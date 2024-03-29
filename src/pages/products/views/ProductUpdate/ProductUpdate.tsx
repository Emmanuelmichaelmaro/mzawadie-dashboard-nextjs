// @ts-nocheck
import placeholderImg from "@assets/images/placeholder255x255.png";
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@mzawadie/components/Attributes";
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/queries";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@mzawadie/core";
import { commonMessages, errorMessages } from "@mzawadie/core";
import { getMutationState } from "@mzawadie/core";
import {
    ProductMediaCreateMutationVariables,
    useProductDeleteMutation,
    useProductDetailsQuery,
    useProductMediaCreateMutation,
    useProductMediaDeleteMutation,
    useProductMediaReorderMutation,
    useWarehouseListQuery,
} from "@mzawadie/graphql";
import { getSearchFetchMoreProps } from "@mzawadie/hooks/makeTopLevelSearch/utils";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useSearchAttributeValuesSuggestions } from "@mzawadie/searches/useAttributeValueSearch";
import useCategorySearch from "@mzawadie/searches/useCategorySearch";
import useCollectionSearch from "@mzawadie/searches/useCollectionSearch";
import usePageSearch from "@mzawadie/searches/usePageSearch";
import useProductSearch from "@mzawadie/searches/useProductSearch";
import { getProductErrorMessage } from "@mzawadie/utils/errors";
import useAttributeValueSearchHandler from "@mzawadie/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { ProductUpdatePage } from "../../components/ProductUpdatePage";
import {
    productListUrl,
    productUrl,
    ProductUrlDialog,
    ProductUrlQueryParams,
    productVariantEditUrl,
} from "../../urls";
import { createImageReorderHandler, createImageUploadHandler } from "./handlers";
import { useProductUpdateHandler } from "./handlers/useProductUpdateHandler";

const messages = defineMessages({
    deleteProductDialogTitle: {
        id: "TWVx7O",
        defaultMessage: "Delete Product",
        description: "delete product dialog title",
    },
    deleteProductDialogSubtitle: {
        id: "ZHF4Z9",
        defaultMessage: "Are you sure you want to delete {name}?",
        description: "delete product dialog subtitle",
    },
    deleteVariantDialogTitle: {
        id: "6iw4VR",
        defaultMessage: "Delete Product Variants",
        description: "delete variant dialog title",
    },
    deleteVariantDialogSubtitle: {
        id: "ukdRUv",
        defaultMessage:
            "{counter,plural,one{Are you sure you want to delete this variant?} other{Are you sure you want to delete {displayQuantity} variants?}}",
        description: "delete variant dialog subtitle",
    },
});

interface ProductUpdateProps {
    id: string;
    params: ProductUrlQueryParams;
}

export const ProductUpdate: React.FC<ProductUpdateProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const {
        loadMore: loadMoreCategories,
        search: searchCategories,
        result: searchCategoriesOpts,
    } = useCategorySearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const {
        loadMore: loadMoreCollections,
        search: searchCollections,
        result: searchCollectionsOpts,
    } = useCollectionSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const {
        loadMore: loadMorePages,
        search: searchPages,
        result: searchPagesOpts,
    } = usePageSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const {
        loadMore: loadMoreProducts,
        search: searchProducts,
        result: searchProductsOpts,
    } = useProductSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const {
        loadMore: loadMoreAttributeValues,
        search: searchAttributeValues,
        result: searchAttributeValuesOpts,
        reset: searchAttributeReset,
    } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);

    const { data, loading, refetch } = useProductDetailsQuery({
        displayLoader: true,
        variables: {
            id,
            firstValues: VALUES_PAGINATE_BY,
        },
    });

    const isSimpleProduct = !data?.product?.productType?.hasVariants;

    const { availableChannels } = useAppChannel(false);

    const limitOpts = useShopLimitsQuery({
        variables: {
            productVariants: true,
        },
    });

    const [reorderProductImages, reorderProductImagesOpts] = useProductMediaReorderMutation({});

    const [deleteProduct, deleteProductOpts] = useProductDeleteMutation({
        onCompleted: () => {
            notify({
                status: "success",
                text: intl.formatMessage({
                    id: "vlVTmY",
                    defaultMessage: "Product removed",
                }),
            });
            navigate(productListUrl());
        },
    });

    const [createProductImage, createProductImageOpts] = useProductMediaCreateMutation({
        onCompleted: (data) => {
            const imageError = data.productMediaCreate?.errors.find(
                (error) => error.field === ("image" as keyof ProductMediaCreateMutationVariables)
            );
            if (imageError) {
                notify({
                    status: "error",
                    title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
                    text: intl.formatMessage(errorMessages.imageUploadErrorText),
                });
            }
        },
    });

    const [deleteProductImage] = useProductMediaDeleteMutation({
        onCompleted: () =>
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            }),
    });

    const [openModal, closeModal] = createDialogActionHandlers<ProductUrlDialog, ProductUrlQueryParams>(
        navigate,
        (params) => productUrl(id, params),
        params
    );

    const product = data?.product;

    const getAttributeValuesSuggestions = useSearchAttributeValuesSuggestions();

    const warehousesQuery = useWarehouseListQuery({
        displayLoader: true,
        variables: {
            first: 50,
        },
    });

    const [createProductMedia, createProductMediaOpts] = useProductMediaCreateMutation({
        onCompleted: (data) => {
            const errors = data.productMediaCreate?.errors;

            if (errors?.length) {
                errors.map((error) =>
                    notify({
                        status: "error",
                        text: getProductErrorMessage(error, intl),
                    })
                );
            } else {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const handleMediaUrlUpload = (mediaUrl: string) => {
        const variables = {
            alt: "",
            mediaUrl,
            product: product.id,
        };

        createProductMedia({
            variables,
        });
    };

    const handleBack = () => navigate(productListUrl());

    const handleImageDelete = (id: string) => () => deleteProductImage({ variables: { id } });

    const [submit, submitOpts] = useProductUpdateHandler(product);

    const warehouses = React.useMemo(
        () => mapEdgesToItems(warehousesQuery.data?.warehouses) || [],
        [warehousesQuery.data]
    );

    const handleImageUpload = createImageUploadHandler(id, (variables) =>
        createProductImage({ variables })
    );

    const handleImageReorder = createImageReorderHandler(product, (variables) =>
        reorderProductImages({ variables })
    );

    const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
        navigate(
            productUrl(id, {
                action: "assign-attribute-value",
                id: attribute.id,
            }),
            { resetScroll: false }
        );

    const disableFormSave =
        submitOpts.loading ||
        createProductImageOpts.loading ||
        deleteProductOpts.loading ||
        reorderProductImagesOpts.loading ||
        createProductMediaOpts.loading ||
        loading;

    const formTransitionState = getMutationState(
        submitOpts.called,
        submitOpts.loading,
        submitOpts.errors,
        createProductMediaOpts.data?.productMediaCreate?.errors
    );

    const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search) || [];

    const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search) || [];

    const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute?.choices) || [];

    const fetchMoreCollections = getSearchFetchMoreProps(searchCollectionsOpts, loadMoreCollections);

    const fetchMoreCategories = getSearchFetchMoreProps(searchCategoriesOpts, loadMoreCategories);

    const fetchMoreReferencePages = getSearchFetchMoreProps(searchPagesOpts, loadMorePages);

    const fetchMoreReferenceProducts = getSearchFetchMoreProps(searchProductsOpts, loadMoreProducts);

    const fetchMoreAttributeValues = {
        hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
        loading: !!searchAttributeValuesOpts.loading,
        onFetchMore: loadMoreAttributeValues,
    };

    if (product === null) {
        return <NotFoundPage onBack={handleBack} />;
    }

    return (
        <>
            <WindowTitle title={data?.product?.name} />

            <ProductUpdatePage
                channels={availableChannels}
                productId={id}
                isSimpleProduct={isSimpleProduct}
                channelsErrors={submitOpts.channelsErrors}
                categories={categories}
                collections={collections}
                attributeValues={attributeValues}
                disabled={disableFormSave}
                errors={submitOpts.errors}
                variantListErrors={submitOpts.variantListErrors}
                fetchCategories={searchCategories}
                fetchCollections={searchCollections}
                fetchAttributeValues={searchAttributeValues}
                refetch={refetch}
                limits={limitOpts.data?.shop.limits}
                saveButtonBarState={formTransitionState}
                media={data?.product?.media}
                header={product?.name}
                placeholderImage={placeholderImg}
                product={product}
                warehouses={warehouses}
                taxTypes={data?.taxTypes}
                variants={product?.variants}
                onDelete={() => openModal("remove")}
                onImageReorder={handleImageReorder}
                onMediaUrlUpload={handleMediaUrlUpload}
                onSubmit={submit}
                onVariantShow={(variantId) =>
                    navigate(productVariantEditUrl(product.id, variantId), {
                        resetScroll: true,
                    })
                }
                onImageUpload={handleImageUpload}
                onImageDelete={handleImageDelete}
                fetchMoreCategories={fetchMoreCategories}
                fetchMoreCollections={fetchMoreCollections}
                assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
                onAssignReferencesClick={handleAssignAttributeReferenceClick}
                referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
                referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
                fetchReferencePages={searchPages}
                fetchMoreReferencePages={fetchMoreReferencePages}
                fetchReferenceProducts={searchProducts}
                fetchMoreReferenceProducts={fetchMoreReferenceProducts}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onCloseDialog={() => navigate(productUrl(id), { resetScroll: false })}
                onAttributeSelectBlur={searchAttributeReset}
                onAttributeValuesSearch={getAttributeValuesSuggestions}
            />

            <ActionDialog
                open={params.action === "remove"}
                onClose={closeModal}
                confirmButtonState={deleteProductOpts.status}
                onConfirm={() => deleteProduct({ variables: { id } })}
                variant="delete"
                title={intl.formatMessage(messages.deleteProductDialogTitle)}
            >
                <DialogContentText>
                    <FormattedMessage
                        {...messages.deleteProductDialogSubtitle}
                        values={{ name: product?.name }}
                    />
                </DialogContentText>
            </ActionDialog>
        </>
    );
};

export default ProductUpdate;
