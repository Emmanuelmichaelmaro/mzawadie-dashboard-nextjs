// @ts-nocheck
import placeholderImg from "@assets/images/placeholder255x255.png";
import { AttributeInput } from "@mzawadie/components/Attributes";
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    commonMessages,
    extractMutationErrors,
    weight,
} from "@mzawadie/core";
import {
    ProductErrorWithAttributesFragment,
    ProductVariantFragment,
    useAttributeValueDeleteMutation,
    useFileUploadMutation,
    useProductVariantChannelListingUpdateMutation,
    useProductVariantDetailsQuery,
    useProductVariantPreorderDeactivateMutation,
    useProductVariantReorderMutation,
    useUpdateMetadataMutation,
    useUpdatePrivateMetadataMutation,
    useVariantDeleteMutation,
    useVariantMediaAssignMutation,
    useVariantMediaUnassignMutation,
    useVariantUpdateMutation,
    useWarehouseListQuery,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useOnSetDefaultVariant from "@mzawadie/hooks/useOnSetDefaultVariant";
import useShop from "@mzawadie/hooks/useShop";
import {
    getAttributesAfterFileAttributesUpdate,
    mergeAttributeValueDeleteErrors,
    mergeFileUploadErrors,
} from "@mzawadie/pages/attributes/utils/data";
import {
    handleDeleteMultipleAttributeValues,
    handleUploadMultipleFiles,
    prepareAttributesInput,
} from "@mzawadie/pages/attributes/utils/handlers";
import { createVariantChannels } from "@mzawadie/pages/channels/utils";
import { warehouseAddPath } from "@mzawadie/pages/warehouses/urls";
import usePageSearch from "@mzawadie/searches/usePageSearch";
import useProductSearch from "@mzawadie/searches/useProductSearch";
import useAttributeValueSearchHandler from "@mzawadie/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@mzawadie/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ProductVariantDeleteDialog } from "../components/ProductVariantDeleteDialog";
import { ProductVariantPage } from "../components/ProductVariantPage";
import { ProductVariantUpdateSubmitData } from "../components/ProductVariantPage/form";
import {
    productUrl,
    productVariantAddUrl,
    productVariantEditUrl,
    ProductVariantEditUrlDialog,
    ProductVariantEditUrlQueryParams,
} from "../urls";
import { mapFormsetStockToStockInput } from "../utils/data";
import { createVariantReorderHandler } from "./ProductUpdate/handlers";

interface ProductUpdateProps {
    variantId: string;
    productId: string;
    params: ProductVariantEditUrlQueryParams;
}

export const ProductVariant: React.FC<ProductUpdateProps> = ({ variantId, productId, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const shop = useShop();

    const [errors, setErrors] = useState<ProductErrorWithAttributesFragment[]>([]);

    useEffect(() => {
        setErrors([]);
    }, [variantId]);

    const warehouses = useWarehouseListQuery({
        displayLoader: true,
        variables: {
            first: 50,
        },
    });

    const { data, loading } = useProductVariantDetailsQuery({
        displayLoader: true,
        variables: {
            id: variantId,
            firstValues: 10,
        },
    });

    const [updateMetadata] = useUpdateMetadataMutation({});
    const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

    const [updateChannels, updateChannelsOpts] = useProductVariantChannelListingUpdateMutation({});

    const [openModal] = createDialogActionHandlers<
        ProductVariantEditUrlDialog,
        ProductVariantEditUrlQueryParams
    >(navigate, (params) => productVariantEditUrl(productId, variantId, params), params);

    const handleBack = () => navigate(productUrl(productId));

    const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

    const [assignMedia, assignMediaOpts] = useVariantMediaAssignMutation({});

    const [unassignMedia, unassignMediaOpts] = useVariantMediaUnassignMutation({});

    const [deleteVariant, deleteVariantOpts] = useVariantDeleteMutation({
        onCompleted: () => {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Variant removed",
                    id: "BUKMzM",
                }),
            });
            navigate(productUrl(productId));
        },
    });

    const [updateVariant, updateVariantOpts] = useVariantUpdateMutation({
        onCompleted: (data) => {
            if (data.productVariantUpdate.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
            setErrors(data.productVariantUpdate.errors);
        },
    });

    const [deleteAttributeValue, deleteAttributeValueOpts] = useAttributeValueDeleteMutation({});

    const handleSubmitChannels = async (
        data: ProductVariantUpdateSubmitData,
        variant: ProductVariantFragment
    ) => {
        const channelsHaveChanged = data.channelListings.some((channel) => {
            const variantChannel = variant.channelListings.find(
                (variantChannel) => variantChannel.channel.id === channel.id
            );

            const priceHasChanged = channel.value.price !== variantChannel?.price?.amount.toString();

            const costPriceHasChanged =
                channel.value.costPrice !== variantChannel?.costPrice?.amount.toString();

            const preorderThresholdHasChanged =
                channel.value?.preorderThreshold !== variantChannel.preorderThreshold.quantity;

            return priceHasChanged || costPriceHasChanged || preorderThresholdHasChanged;
        });

        if (channelsHaveChanged) {
            return extractMutationErrors(
                updateChannels({
                    variables: {
                        id: variant.id,
                        input: data.channelListings.map((listing) => ({
                            channelId: listing.id,
                            costPrice: listing.value.costPrice || null,
                            price: listing.value.price,
                            preorderThreshold: listing.value.preorderThreshold,
                        })),
                    },
                })
            );
        }
    };

    const variant = data?.productVariant;

    const channels = createVariantChannels(variant);

    if (variant === null) {
        return <NotFoundPage onBack={handleBack} />;
    }

    const [deactivatePreorder, deactivatePreoderOpts] = useProductVariantPreorderDeactivateMutation({});

    const handleDeactivateVariantPreorder = (id: string) => deactivatePreorder({ variables: { id } });

    const [reorderProductVariants, reorderProductVariantsOpts] = useProductVariantReorderMutation({});

    const onSetDefaultVariant = useOnSetDefaultVariant(productId, variant);

    const handleVariantReorder = createVariantReorderHandler(variant?.product, (variables) =>
        reorderProductVariants({ variables })
    );

    const disableFormSave =
        loading ||
        uploadFileOpts.loading ||
        deleteVariantOpts.loading ||
        updateVariantOpts.loading ||
        assignMediaOpts.loading ||
        unassignMediaOpts.loading ||
        deactivatePreoderOpts.loading ||
        reorderProductVariantsOpts.loading ||
        deleteAttributeValueOpts.loading;

    const handleMediaSelect = (id: string) => () => {
        if (variant) {
            if (variant?.media?.map((media_obj) => media_obj.id).indexOf(id) !== -1) {
                unassignMedia({
                    variables: {
                        mediaId: id,
                        variantId: variant.id,
                    },
                });
            } else {
                assignMedia({
                    variables: {
                        mediaId: id,
                        variantId: variant.id,
                    },
                });
            }
        }
    };

    const handleUpdate = async (data: ProductVariantUpdateSubmitData) => {
        const uploadFilesResult = await handleUploadMultipleFiles(
            data.attributesWithNewFileValue,
            (variables) => uploadFile({ variables })
        );

        const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
            data.attributesWithNewFileValue,
            variant?.nonSelectionAttributes,
            (variables) => deleteAttributeValue({ variables })
        );

        const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
            data.attributesWithNewFileValue,
            uploadFilesResult
        );

        const result = await updateVariant({
            variables: {
                addStocks: data.addStocks.map(mapFormsetStockToStockInput),
                attributes: prepareAttributesInput({
                    attributes: data.attributes,
                    updatedFileAttributes,
                }),
                id: variantId,
                removeStocks: data.removeStocks,
                sku: data.sku,
                quantityLimitPerCustomer: Number(data.quantityLimitPerCustomer) || null,
                stocks: data.updateStocks.map(mapFormsetStockToStockInput),
                trackInventory: data.trackInventory,
                preorder: data.isPreorder
                    ? {
                          globalThreshold: data.globalThreshold
                              ? parseInt(data.globalThreshold, 10)
                              : null,
                          endDate: data?.preorderEndDateTime || null,
                      }
                    : null,
                weight: weight(data.weight),
                firstValues: 10,
            },
        });

        await handleSubmitChannels(data, variant);

        return [
            ...mergeFileUploadErrors(uploadFilesResult),
            ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
            ...result.data?.productVariantStocksCreate.errors,
            ...result.data?.productVariantStocksDelete.errors,
            ...result.data?.productVariantStocksUpdate.errors,
            ...result.data?.productVariantUpdate.errors,
        ];
    };

    const handleSubmit = createMetadataUpdateHandler(
        data?.productVariant,
        handleUpdate,
        (variables) => updateMetadata({ variables }),
        (variables) => updatePrivateMetadata({ variables })
    );

    const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
        navigate(
            productVariantEditUrl(productId, variantId, {
                action: "assign-attribute-value",
                id: attribute.id,
            })
        );

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

    const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

    return (
        <>
            <WindowTitle title={data?.productVariant?.name} />

            <ProductVariantPage
                defaultWeightUnit={shop?.defaultWeightUnit}
                defaultVariantId={data?.productVariant.product.defaultVariant?.id}
                errors={errors}
                attributeValues={attributeValues}
                channels={channels}
                channelErrors={
                    updateChannelsOpts?.data?.productVariantChannelListingUpdate?.errors || []
                }
                onSetDefaultVariant={onSetDefaultVariant}
                saveButtonBarState={updateVariantOpts.status}
                loading={disableFormSave}
                placeholderImage={placeholderImg}
                variant={variant}
                header={variant?.name || variant?.sku}
                warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
                onAdd={() => navigate(productVariantAddUrl(productId))}
                onBack={handleBack}
                onDelete={() => openModal("remove")}
                onMediaSelect={handleMediaSelect}
                onSubmit={async (data) => {
                    const errors = await handleSubmit(data);
                    const channelErrors = await handleSubmitChannels(data, variant);
                    return [...errors, ...channelErrors];
                }}
                onWarehouseConfigure={() => navigate(warehouseAddPath)}
                onVariantClick={(variantId) => {
                    navigate(productVariantEditUrl(productId, variantId));
                }}
                onVariantPreorderDeactivate={handleDeactivateVariantPreorder}
                variantDeactivatePreoderButtonState={deactivatePreoderOpts.status}
                onVariantReorder={handleVariantReorder}
                assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
                onAssignReferencesClick={handleAssignAttributeReferenceClick}
                referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
                referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
                fetchReferencePages={searchPages}
                fetchMoreReferencePages={fetchMoreReferencePages}
                fetchReferenceProducts={searchProducts}
                fetchMoreReferenceProducts={fetchMoreReferenceProducts}
                fetchAttributeValues={searchAttributeValues}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onCloseDialog={() => navigate(productVariantEditUrl(productId, variantId))}
                onAttributeSelectBlur={searchAttributeReset}
            />

            <ProductVariantDeleteDialog
                confirmButtonState={deleteVariantOpts.status}
                onClose={() => navigate(productVariantEditUrl(productId, variantId))}
                onConfirm={() =>
                    deleteVariant({
                        variables: {
                            id: variantId,
                        },
                    })
                }
                open={params.action === "remove"}
                name={data?.productVariant?.name}
            />
        </>
    );
};

export default ProductVariant;
