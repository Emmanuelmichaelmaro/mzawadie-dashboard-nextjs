/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck
import { AttributeInput } from "@mzawadie/components/Attributes";
import NotFoundPage from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, weight } from "@mzawadie/core";
import { useFileUploadMutation } from "@mzawadie/core/files/mutations";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useShop from "@mzawadie/hooks/useShop";
import useAttributeValueSearchHandler from "@mzawadie/utils/handlers/attributeValueSearchHandler";
import createMetadataCreateHandler from "@mzawadie/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { useMetadataUpdate, usePrivateMetadataUpdate } from "@mzawadie/utils/metadata/updateMetadata";
import { getAttributesAfterFileAttributesUpdate } from "@mzawadie/views/attributes/utils/data";
import {
    handleUploadMultipleFiles,
    prepareAttributesInput,
} from "@mzawadie/views/attributes/utils/handlers";
import { ChannelPriceData } from "@mzawadie/views/channels/utils";
import { useProductVariantCreateQuery } from "@mzawadie/views/products/queries";
import {
    productListUrl,
    productUrl,
    productVariantAddUrl,
    ProductVariantAddUrlQueryParams,
    productVariantEditUrl,
} from "@mzawadie/views/products/urls";
import usePageSearch from "@mzawadie/views/searches/usePageSearch";
import useProductSearch from "@mzawadie/views/searches/useProductSearch";
import { useWarehouseList } from "@mzawadie/views/warehouses/queries";
import { warehouseAddPath } from "@mzawadie/views/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import ProductVariantCreatePage from "../components/ProductVariantCreatePage";
import { ProductVariantCreateData } from "../components/ProductVariantCreatePage/form";
import { useProductVariantReorderMutation, useVariantCreateMutation } from "../mutations";
import { createVariantReorderHandler } from "./ProductUpdate/handlers";

interface ProductVariantCreateProps {
    productId: string;
    params: ProductVariantAddUrlQueryParams;
}

export const ProductVariant: React.FC<ProductVariantCreateProps> = ({ productId, params }) => {
    const navigate = useNavigator();

    const shop = useShop();

    const intl = useIntl();

    const warehouses = useWarehouseList({
        displayLoader: true,
        variables: {
            first: 50,
        },
    });

    const { data, loading: productLoading } = useProductVariantCreateQuery({
        displayLoader: true,
        variables: {
            id: productId,
            firstValues: 10,
        },
    });

    const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

    const product = data?.product;

    const channels: ChannelPriceData[] = product?.channelListings.map((listing: any) => ({
        costPrice: null,
        currency: listing.channel.currencyCode,
        id: listing.channel.id,
        name: listing.channel.name,
        price: null,
    }));

    const [variantCreate, variantCreateResult] = useVariantCreateMutation({});

    const [updateMetadata] = useMetadataUpdate({});

    const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

    if (product === null) {
        return <NotFoundPage onBack={() => navigate(productListUrl())} />;
    }

    const [reorderProductVariants, reorderProductVariantsOpts] = useProductVariantReorderMutation({});

    const handleVariantReorder = createVariantReorderHandler(product, (variables) =>
        reorderProductVariants({ variables })
    );

    const handleBack = () => navigate(productUrl(productId));

    const handleCreate = async (formData: ProductVariantCreateData) => {
        const uploadFilesResult = await handleUploadMultipleFiles(
            formData.attributesWithNewFileValue,
            (variables) => uploadFile({ variables })
        );

        const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
            formData.attributesWithNewFileValue,
            uploadFilesResult
        );

        const result = await variantCreate({
            variables: {
                input: {
                    attributes: prepareAttributesInput({
                        attributes: formData.attributes.filter(
                            (attribute) => attribute.value?.length && attribute.value[0] !== ""
                        ),
                        updatedFileAttributes,
                    }),
                    product: productId,
                    sku: formData.sku,
                    stocks: formData.stocks.map((stock) => ({
                        // eslint-disable-next-line radix
                        quantity: parseInt(stock.value, 0) || 0,
                        warehouse: stock.id,
                    })),
                    trackInventory: true,
                    weight: weight(formData.weight),
                },
                firstValues: 10,
            },
        });
        const id = result.data?.productVariantCreate?.productVariant?.id;

        return id || null;
    };

    const handleSubmit = createMetadataCreateHandler(
        handleCreate,
        updateMetadata,
        updatePrivateMetadata
    );

    const handleVariantClick = (id: string) => navigate(productVariantEditUrl(productId, id));

    const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
        navigate(
            productVariantAddUrl(productId, {
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

    const disableForm =
        productLoading ||
        uploadFileOpts.loading ||
        variantCreateResult.loading ||
        reorderProductVariantsOpts.loading;

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    defaultMessage: "Create variant",
                    id: "MyM2oR",
                    description: "window title",
                })}
            />

            <ProductVariantCreatePage
                channels={channels}
                disabled={disableForm}
                errors={variantCreateResult.data?.productVariantCreate?.errors || []}
                header={intl.formatMessage({
                    defaultMessage: "Create Variant",
                    id: "T6dXGG",
                    description: "header",
                })}
                product={data?.product}
                attributeValues={attributeValues}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onVariantClick={handleVariantClick}
                onWarehouseConfigure={() => navigate(warehouseAddPath)}
                onVariantReorder={handleVariantReorder}
                saveButtonBarState={variantCreateResult.status}
                warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
                weightUnit={shop?.defaultWeightUnit}
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
                onCloseDialog={() => navigate(productVariantAddUrl(productId))}
                onAttributeSelectBlur={searchAttributeReset}
            />
        </>
    );
};

export default ProductVariant;
