/* eslint-disable @typescript-eslint/no-floating-promises,@typescript-eslint/no-misused-promises */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import placeholderImg from "@assets/images/placeholder255x255.png";
import { DialogContentText, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@mzawadie/components/Attributes";
import ChannelsAvailabilityDialog from "@mzawadie/components/ChannelsAvailabilityDialog";
import NotFoundPage from "@mzawadie/components/NotFoundPage";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/query";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    VALUES_PAGINATE_BY,
    commonMessages,
    errorMessages,
    getMutationState,
} from "@mzawadie/core";
import { useFileUploadMutation } from "@mzawadie/core/files/mutations";
import { getSearchFetchMoreProps } from "@mzawadie/hooks/makeTopLevelSearch/utils";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useChannels from "@mzawadie/hooks/useChannels";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useOnSetDefaultVariant from "@mzawadie/hooks/useOnSetDefaultVariant";
import useShop from "@mzawadie/hooks/useShop";
import { getProductErrorMessage } from "@mzawadie/utils/errors";
import useAttributeValueSearchHandler from "@mzawadie/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { useAttributeValueDeleteMutation } from "@mzawadie/views/attributes/mutations";
import ChannelsWithVariantsAvailabilityDialog from "@mzawadie/views/channels/components/ChannelsWithVariantsAvailabilityDialog";
import {
    ChannelData,
    createChannelsDataWithPrice,
    createSortedChannelsDataFromProduct,
} from "@mzawadie/views/channels/utils";
import ProductVariantCreateDialog from "@mzawadie/views/products/components/ProductVariantCreateDialog";
import {
    useProductChannelListingUpdate,
    useProductDeleteMutation,
    useProductMediaCreateMutation,
    useProductMediaDeleteMutation,
    useProductMediaReorder,
    useProductUpdateMutation,
    useProductVariantBulkDeleteMutation,
    useProductVariantChannelListingUpdate,
    useProductVariantReorderMutation,
    useSimpleProductUpdateMutation,
    useVariantCreateMutation,
} from "@mzawadie/views/products/mutations";
import useCategorySearch from "@mzawadie/views/searches/useCategorySearch";
import useCollectionSearch from "@mzawadie/views/searches/useCollectionSearch";
import usePageSearch from "@mzawadie/views/searches/usePageSearch";
import useProductSearch from "@mzawadie/views/searches/useProductSearch";
import { useWarehouseList } from "@mzawadie/views/warehouses/queries";
import { warehouseAddPath } from "@mzawadie/views/warehouses/urls";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import ProductUpdatePage, { ProductUpdatePageSubmitData } from "../../components/ProductUpdatePage";
import { useProductDetails } from "../../queries";
import { ProductMediaCreateVariables } from "../../types/ProductMediaCreate";
import { ProductUpdate as ProductUpdateMutationResult } from "../../types/ProductUpdate";
import {
    productImageUrl,
    productListUrl,
    productUrl,
    ProductUrlDialog,
    ProductUrlQueryParams,
    productVariantAddUrl,
    productVariantCreatorUrl,
    productVariantEditUrl,
} from "../../urls";
import {
    createImageReorderHandler,
    createImageUploadHandler,
    createUpdateHandler,
    createVariantReorderHandler,
} from "./handlers";
import useChannelsWithProductVariants from "./useChannelsWithProductVariants";

const messages = defineMessages({
    deleteProductDialogTitle: {
        defaultMessage: "Delete Product",
        id: "TWVx7O",
        description: "delete product dialog title",
    },
    deleteProductDialogSubtitle: {
        defaultMessage: "Are you sure you want to delete {name}?",
        id: "ZHF4Z9",
        description: "delete product dialog subtitle",
    },
    deleteVariantDialogTitle: {
        defaultMessage: "Delete Product Variants",
        id: "6iw4VR",
        description: "delete variant dialog title",
    },
    deleteVariantDialogSubtitle: {
        defaultMessage:
            "{counter,plural,one{Are you sure you want to delete this variant?} other{Are you sure you want to delete {displayQuantity} variants?}}",
        id: "ukdRUv",
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
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
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
    const warehouses = useWarehouseList({
        displayLoader: true,
        variables: {
            first: 50,
        },
    });
    const shop = useShop();
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
    const [productVariantCreate, productVariantCreateOpts] = useVariantCreateMutation({});

    const { availableChannels, channel } = useAppChannel(false);
    const { data, loading, refetch } = useProductDetails({
        displayLoader: true,
        variables: {
            id,
            firstValues: VALUES_PAGINATE_BY,
        },
    });
    const limitOpts = useShopLimitsQuery({
        variables: {
            productVariants: true,
        },
    });

    const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

    const handleUpdate = (data: ProductUpdateMutationResult) => {
        if (data.productUpdate.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
        }
    };
    const [updateProduct, updateProductOpts] = useProductUpdateMutation({
        onCompleted: handleUpdate,
    });
    const [updateSimpleProduct, updateSimpleProductOpts] = useSimpleProductUpdateMutation({
        onCompleted: handleUpdate,
    });

    const [reorderProductImages, reorderProductImagesOpts] = useProductMediaReorder({});

    const [deleteProduct, deleteProductOpts] = useProductDeleteMutation({
        onCompleted: () => {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Product removed",
                    id: "vlVTmY",
                }),
            });
            navigate(productListUrl());
        },
    });

    const [createProductImage, createProductImageOpts] = useProductMediaCreateMutation({
        onCompleted: (data) => {
            const imageError = data.productMediaCreate.errors.find(
                (error) => error.field === ("image" as keyof ProductMediaCreateVariables)
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

    const [bulkProductVariantDelete, bulkProductVariantDeleteOpts] =
        useProductVariantBulkDeleteMutation({
            onCompleted: (data) => {
                if (data.productVariantBulkDelete.errors.length === 0) {
                    closeModal();
                    reset();
                    refetch();
                    limitOpts.refetch();
                }
            },
        });

    const [openModal, closeModal] = createDialogActionHandlers<ProductUrlDialog, ProductUrlQueryParams>(
        navigate,
        (params) => productUrl(id, params),
        params
    );

    const product = data?.product;

    const allChannels: ChannelData[] = createChannelsDataWithPrice(product, availableChannels).sort(
        (channel, nextChannel) => channel.name.localeCompare(nextChannel.name)
    );

    const isSimpleProduct = !data?.product?.productType?.hasVariants;

    const {
        channelsWithVariantsData,
        haveChannelsWithVariantsDataChanged,
        setHaveChannelsWithVariantsChanged,
        onChannelsAvailiabilityModalOpen,
        channelsData,
        setChannelsData,
        ...channelsWithVariantsProps
    } = useChannelsWithProductVariants({
        channels: allChannels,
        variants: product?.variants,
        action: params?.action,
        openModal,
        closeModal,
    });

    const productChannelsChoices: ChannelData[] = createSortedChannelsDataFromProduct(product);

    const {
        channelListElements,
        channelsToggle,
        currentChannels,
        handleChannelsConfirm,
        handleChannelsModalClose,
        handleChannelsModalOpen,
        isChannelSelected,
        isChannelsModalOpen,
        setCurrentChannels,
        toggleAllChannels,
    } = useChannels(productChannelsChoices, params?.action, {
        closeModal,
        openModal,
    });

    const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdate({
        onCompleted: (data) => {
            if (data.productChannelListingUpdate.errors.length) {
                data.productChannelListingUpdate.errors.forEach((error) =>
                    notify({
                        status: "error",
                        text: getProductErrorMessage(error, intl),
                    })
                );
            }
        },
    });

    const [updateVariantChannels, updateVariantChannelsOpts] = useProductVariantChannelListingUpdate(
        {}
    );

    const [createProductMedia, createProductMediaOpts] = useProductMediaCreateMutation({
        onCompleted: (data) => {
            const { errors } = data.productMediaCreate;

            if (errors.length) {
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

    const [deleteAttributeValue, deleteAttributeValueOpts] = useAttributeValueDeleteMutation({});

    const handleBack = () => navigate(productListUrl());

    if (product === null) {
        return <NotFoundPage onBack={handleBack} />;
    }
    const handleVariantAdd = () => navigate(productVariantAddUrl(id));
    const handleVariantsAdd = () => navigate(productVariantCreatorUrl(id));

    const handleImageDelete = (id: string) => () => deleteProductImage({ variables: { id } });
    const handleImageEdit = (imageId: string) => () => navigate(productImageUrl(id, imageId));

    const handleSubmit = createMetadataUpdateHandler(
        product,
        createUpdateHandler(
            product,
            allChannels,
            (variables) => uploadFile({ variables }),
            (variables) => updateProduct({ variables }),
            (variables) => updateSimpleProduct({ variables }),
            updateChannels,
            updateVariantChannels,
            productVariantCreate,
            (variables) => deleteAttributeValue({ variables })
        ),
        (variables) => updateMetadata({ variables }),
        (variables) => updatePrivateMetadata({ variables })
    );

    const handleImageUpload = createImageUploadHandler(id, (variables) =>
        createProductImage({ variables })
    );
    const handleImageReorder = createImageReorderHandler(product, (variables) =>
        reorderProductImages({ variables })
    );

    const [reorderProductVariants, reorderProductVariantsOpts] = useProductVariantReorderMutation({});

    const handleVariantReorder = createVariantReorderHandler(product, (variables) =>
        reorderProductVariants({ variables })
    );

    const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
        navigate(
            productUrl(id, {
                action: "assign-attribute-value",
                id: attribute.id,
            })
        );

    const disableFormSave =
        uploadFileOpts.loading ||
        createProductImageOpts.loading ||
        deleteProductOpts.loading ||
        reorderProductImagesOpts.loading ||
        updateProductOpts.loading ||
        reorderProductVariantsOpts.loading ||
        updateChannelsOpts.loading ||
        updateVariantChannelsOpts.loading ||
        productVariantCreateOpts.loading ||
        deleteAttributeValueOpts.loading ||
        createProductMediaOpts.loading ||
        loading;

    const formTransitionState = getMutationState(
        updateProductOpts.called || updateSimpleProductOpts.called,
        updateProductOpts.loading || updateSimpleProductOpts.loading,
        updateProductOpts.data?.productUpdate.errors,
        updateSimpleProductOpts.data?.productUpdate.errors,
        updateSimpleProductOpts.data?.productVariantUpdate.errors,
        createProductMediaOpts.data?.productMediaCreate.errors
    );

    const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search) || [];

    const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search) || [];

    const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

    const errors = [
        ...(updateProductOpts.data?.productUpdate.errors || []),
        ...(updateSimpleProductOpts.data?.productUpdate.errors || []),
        ...(productVariantCreateOpts.data?.productVariantCreate.errors || []),
    ];

    const onSetDefaultVariant = useOnSetDefaultVariant(product ? product.id : null, null);
    const channelsErrors = [
        ...(updateChannelsOpts?.data?.productChannelListingUpdate?.errors || []),
        ...(updateVariantChannelsOpts?.data?.productVariantChannelListingUpdate?.errors || []),
    ];

    const fetchMoreCollections = getSearchFetchMoreProps(searchCollectionsOpts, loadMoreCollections);

    const fetchMoreCategories = getSearchFetchMoreProps(searchCategoriesOpts, loadMoreCategories);

    const fetchMoreReferencePages = getSearchFetchMoreProps(searchPagesOpts, loadMorePages);

    const fetchMoreReferenceProducts = getSearchFetchMoreProps(searchProductsOpts, loadMoreProducts);

    const fetchMoreAttributeValues = {
        hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
        loading: !!searchAttributeValuesOpts.loading,
        onFetchMore: loadMoreAttributeValues,
    };

    return (
        <>
            <WindowTitle title={data?.product?.name} />

            {!!allChannels?.length &&
                (isSimpleProduct ? (
                    <ChannelsAvailabilityDialog
                        isSelected={isChannelSelected}
                        channels={allChannels}
                        onChange={channelsToggle}
                        onClose={handleChannelsModalClose}
                        open={isChannelsModalOpen}
                        title={intl.formatMessage({
                            defaultMessage: "Manage Products Channel Availability",
                            id: "Eau5AV",
                        })}
                        confirmButtonState="default"
                        selected={channelListElements.length}
                        onConfirm={handleChannelsConfirm}
                        toggleAll={toggleAllChannels}
                    />
                ) : (
                    <ChannelsWithVariantsAvailabilityDialog
                        channelsWithVariantsData={channelsWithVariantsData}
                        haveChannelsWithVariantsDataChanged={haveChannelsWithVariantsDataChanged}
                        {...channelsWithVariantsProps}
                        channels={allChannels}
                        variants={product?.variants}
                    />
                ))}

            <ProductUpdatePage
                hasChannelChanged={
                    haveChannelsWithVariantsDataChanged ||
                    productChannelsChoices?.length !== currentChannels?.length
                }
                isSimpleProduct={isSimpleProduct}
                openChannelsModal={handleChannelsModalOpen}
                onChannelsChange={setCurrentChannels}
                channelsErrors={channelsErrors}
                currentChannels={currentChannels}
                allChannelsCount={allChannels?.length}
                channelsData={channelsData}
                setChannelsData={setChannelsData}
                categories={categories}
                collections={collections}
                attributeValues={attributeValues}
                channelsWithVariantsData={channelsWithVariantsData}
                defaultWeightUnit={shop?.defaultWeightUnit}
                disabled={disableFormSave}
                onSetDefaultVariant={onSetDefaultVariant}
                errors={errors}
                fetchCategories={searchCategories}
                fetchCollections={searchCollections}
                fetchAttributeValues={searchAttributeValues}
                limits={limitOpts.data?.shop.limits}
                saveButtonBarState={formTransitionState}
                media={data?.product?.media}
                header={product?.name}
                placeholderImage={placeholderImg}
                product={product}
                warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
                taxTypes={data?.taxTypes}
                variants={product?.variants}
                onBack={handleBack}
                onDelete={() => openModal("remove")}
                onImageReorder={handleImageReorder}
                onMediaUrlUpload={handleMediaUrlUpload}
                onSubmit={(formData: ProductUpdatePageSubmitData) => {
                    setHaveChannelsWithVariantsChanged(false);
                    return handleSubmit(formData);
                }}
                onWarehouseConfigure={() => navigate(warehouseAddPath)}
                onVariantAdd={handleVariantAdd}
                onVariantsAdd={() => openModal("add-variants")}
                onVariantShow={(variantId) => () =>
                    navigate(productVariantEditUrl(product.id, variantId))}
                onVariantReorder={handleVariantReorder}
                onImageUpload={handleImageUpload}
                onImageEdit={handleImageEdit}
                onImageDelete={handleImageDelete}
                toolbar={
                    <IconButton
                        color="primary"
                        onClick={() =>
                            openModal("remove-variants", {
                                ids: listElements,
                            })
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                }
                isChecked={isSelected}
                selected={listElements.length}
                toggle={toggle}
                toggleAll={toggleAll}
                fetchMoreCategories={fetchMoreCategories}
                fetchMoreCollections={fetchMoreCollections}
                selectedChannelId={channel?.id}
                assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
                onAssignReferencesClick={handleAssignAttributeReferenceClick}
                referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
                referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
                fetchReferencePages={searchPages}
                fetchMoreReferencePages={fetchMoreReferencePages}
                fetchReferenceProducts={searchProducts}
                fetchMoreReferenceProducts={fetchMoreReferenceProducts}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onCloseDialog={() => navigate(productUrl(id))}
                onAttributeSelectBlur={searchAttributeReset}
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

            <ActionDialog
                open={params.action === "remove-variants"}
                onClose={closeModal}
                confirmButtonState={bulkProductVariantDeleteOpts.status}
                onConfirm={() =>
                    bulkProductVariantDelete({
                        variables: {
                            ids: params.ids,
                        },
                    })
                }
                variant="delete"
                title={intl.formatMessage(messages.deleteVariantDialogTitle)}
            >
                <DialogContentText>
                    <FormattedMessage
                        {...messages.deleteVariantDialogSubtitle}
                        values={{
                            counter: params?.ids?.length,
                            displayQuantity: <strong>{params?.ids?.length}</strong>,
                        }}
                    />
                </DialogContentText>
            </ActionDialog>

            <ProductVariantCreateDialog
                open={params.action === "add-variants"}
                onClose={closeModal}
                onConfirm={(option) =>
                    option === "multiple" ? handleVariantsAdd() : handleVariantAdd()
                }
            />
        </>
    );
};

export default ProductUpdate;
