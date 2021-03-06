// @ts-nocheck
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@mzawadie/components/Attributes";
import ChannelsAvailabilityDialog from "@mzawadie/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@mzawadie/core";
import { useFileUploadMutation } from "@mzawadie/core/files/mutations";
import useChannels from "@mzawadie/hooks/useChannels";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { getProductErrorMessage } from "@mzawadie/utils/errors";
import useAttributeValueSearchHandler from "@mzawadie/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { ChannelData, createSortedChannelsData } from "@mzawadie/views/channels/utils";
import ProductCreatePage from "@mzawadie/views/products/components/ProductCreatePage";
import {
    useProductChannelListingUpdate,
    useProductCreateMutation,
    useProductDeleteMutation,
    useProductVariantChannelListingUpdate,
    useVariantCreateMutation,
} from "@mzawadie/views/products/mutations";
import { useProductTypeQuery } from "@mzawadie/views/products/queries";
import {
    productAddUrl,
    ProductCreateUrlDialog,
    ProductCreateUrlQueryParams,
    productListUrl,
    productUrl,
} from "@mzawadie/views/products/urls";
import useCategorySearch from "@mzawadie/views/searches/useCategorySearch";
import useCollectionSearch from "@mzawadie/views/searches/useCollectionSearch";
import usePageSearch from "@mzawadie/views/searches/usePageSearch";
import useProductSearch from "@mzawadie/views/searches/useProductSearch";
import useProductTypeSearch from "@mzawadie/views/searches/useProductTypeSearch";
import { useTaxTypeList } from "@mzawadie/views/taxes/queries";
import { useWarehouseList } from "@mzawadie/views/warehouses/queries";
import { warehouseAddPath } from "@mzawadie/views/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import { createHandler } from "./handlers";

interface ProductCreateProps {
    params: ProductCreateUrlQueryParams;
}

export const ProductCreateView: React.FC<ProductCreateProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const shop = useShop();
    const intl = useIntl();
    const [productCreateComplete, setProductCreateComplete] = React.useState(false);
    const [selectedProductTypeId, setSelectedProductTypeId] = React.useState<string>();

    const [openModal, closeModal] = createDialogActionHandlers<
        ProductCreateUrlDialog,
        ProductCreateUrlQueryParams
    >(navigate, (params) => productAddUrl(params), params);

    const {
        loadMore: loadMoreCategories,
        search: searchCategory,
        result: searchCategoryOpts,
    } = useCategorySearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });
    const {
        loadMore: loadMoreCollections,
        search: searchCollection,
        result: searchCollectionOpts,
    } = useCollectionSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });
    const {
        loadMore: loadMoreProductTypes,
        search: searchProductTypes,
        result: searchProductTypesOpts,
    } = useProductTypeSearch({
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
    const [updateMetadata] = useMetadataUpdate({});
    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
    const taxTypes = useTaxTypeList({});
    const { data: selectedProductType } = useProductTypeQuery({
        variables: {
            id: selectedProductTypeId,
            firstValues: VALUES_PAGINATE_BY,
        },
        skip: !selectedProductTypeId,
    });

    const productTypes = mapEdgesToItems(searchProductTypesOpts?.data?.search) || [];

    const { availableChannels } = useAppChannel(false);
    const allChannels: ChannelData[] = createSortedChannelsData(availableChannels);

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
    } = useChannels(allChannels, params?.action, {
        closeModal,
        openModal,
    });

    const handleSuccess = (productId: string) => {
        notify({
            status: "success",
            text: intl.formatMessage({
                defaultMessage: "Product created",
                id: "DO8+uV",
            }),
        });
        navigate(productUrl(productId));
    };

    const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

    const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdate({});
    const [updateVariantChannels, updateVariantChannelsOpts] = useProductVariantChannelListingUpdate(
        {}
    );

    const handleBack = () => navigate(productListUrl());

    const [productCreate, productCreateOpts] = useProductCreateMutation({});
    const [deleteProduct] = useProductDeleteMutation({});
    const [productVariantCreate, productVariantCreateOpts] = useVariantCreateMutation({
        onCompleted: (data) => {
            const { errors } = data.productVariantCreate;
            if (errors.length) {
                errors.map((error) =>
                    notify({
                        status: "error",
                        text: getProductErrorMessage(error, intl),
                    })
                );
            }
        },
    });

    const handleSubmit = async (data) => {
        const result = await createMetadataCreateHandler(
            createHandler(
                selectedProductType.productType,
                (variables) => uploadFile({ variables }),
                (variables) => productCreate({ variables }),
                (variables) => productVariantCreate({ variables }),
                updateChannels,
                updateVariantChannels,
                deleteProduct
            ),
            updateMetadata,
            updatePrivateMetadata
        )(data);

        if (result) {
            setProductCreateComplete(true);
        }
    };

    const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
        navigate(
            productAddUrl({
                action: "assign-attribute-value",
                id: attribute.id,
            })
        );

    React.useEffect(() => {
        const productId = productCreateOpts.data?.productCreate?.product?.id;

        if (productCreateComplete && productId) {
            handleSuccess(productId);
        }
    }, [productCreateComplete]);

    const fetchMoreProductTypes = {
        hasMore: searchProductTypesOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchProductTypesOpts.loading,
        onFetchMore: loadMoreProductTypes,
    };
    const fetchMoreCollections = {
        hasMore: searchCollectionOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchCollectionOpts.loading,
        onFetchMore: loadMoreCollections,
    };
    const fetchMoreCategories = {
        hasMore: searchCategoryOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchCategoryOpts.loading,
        onFetchMore: loadMoreCategories,
    };
    const fetchMoreReferencePages = {
        hasMore: searchPagesOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchPagesOpts.loading,
        onFetchMore: loadMorePages,
    };
    const fetchMoreReferenceProducts = {
        hasMore: searchProductsOpts.data?.search?.pageInfo?.hasNextPage,
        loading: searchProductsOpts.loading,
        onFetchMore: loadMoreProducts,
    };
    const fetchMoreAttributeValues = {
        hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
        loading: !!searchAttributeValuesOpts.loading,
        onFetchMore: loadMoreAttributeValues,
    };

    const loading =
        uploadFileOpts.loading ||
        productCreateOpts.loading ||
        productVariantCreateOpts.loading ||
        updateChannelsOpts.loading ||
        updateVariantChannelsOpts.loading;

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Create Product",
                    id: "PXx4Jk",
                    description: "window title",
                })}
            />

            {!!allChannels?.length && (
                <ChannelsAvailabilityDialog
                    isSelected={isChannelSelected}
                    disabled={!channelListElements.length}
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
            )}

            <ProductCreatePage
                allChannelsCount={allChannels?.length}
                currentChannels={currentChannels}
                categories={mapEdgesToItems(searchCategoryOpts?.data?.search) || []}
                collections={mapEdgesToItems(searchCollectionOpts?.data?.search) || []}
                attributeValues={
                    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || []
                }
                loading={loading}
                channelsErrors={
                    updateVariantChannelsOpts.data?.productVariantChannelListingUpdate?.errors
                }
                errors={[
                    ...(productCreateOpts.data?.productCreate.errors || []),
                    ...(productVariantCreateOpts.data?.productVariantCreate.errors || []),
                ]}
                fetchCategories={searchCategory}
                fetchCollections={searchCollection}
                fetchProductTypes={searchProductTypes}
                fetchAttributeValues={searchAttributeValues}
                header={intl.formatMessage({
                    defaultMessage: "New Product",
                    id: "NBP8uu",
                    description: "page header",
                })}
                productTypes={productTypes}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onWarehouseConfigure={() => navigate(warehouseAddPath)}
                saveButtonBarState={productCreateOpts.status}
                fetchMoreCategories={fetchMoreCategories}
                fetchMoreCollections={fetchMoreCollections}
                fetchMoreProductTypes={fetchMoreProductTypes}
                warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
                taxTypes={taxTypes.data?.taxTypes || []}
                weightUnit={shop?.defaultWeightUnit}
                openChannelsModal={handleChannelsModalOpen}
                onChannelsChange={setCurrentChannels}
                assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
                onAssignReferencesClick={handleAssignAttributeReferenceClick}
                referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
                referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
                fetchReferencePages={searchPages}
                fetchMoreReferencePages={fetchMoreReferencePages}
                fetchReferenceProducts={searchProducts}
                fetchMoreReferenceProducts={fetchMoreReferenceProducts}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onCloseDialog={() => navigate(productAddUrl())}
                selectedProductType={selectedProductType?.productType}
                onSelectProductType={(id) => setSelectedProductTypeId(id)}
                onAttributeSelectBlur={searchAttributeReset}
            />
        </>
    );
};

export default ProductCreateView;
