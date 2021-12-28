/* eslint-disable @typescript-eslint/no-floating-promises */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { VALUES_PAGINATE_BY, ReorderEvent } from "@mzawadie/core";
import { FileUpload, FileUploadVariables } from "@mzawadie/core/files/types/FileUpload";
import { AttributeErrorFragment } from "@mzawadie/fragments/types/AttributeErrorFragment";
import { BulkStockErrorFragment } from "@mzawadie/fragments/types/BulkStockErrorFragment";
import { ProductChannelListingErrorFragment } from "@mzawadie/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorFragment } from "@mzawadie/fragments/types/ProductErrorFragment";
import { StockErrorFragment } from "@mzawadie/fragments/types/StockErrorFragment";
import { UploadErrorFragment } from "@mzawadie/fragments/types/UploadErrorFragment";
import { move } from "@mzawadie/utils/lists";
import { getParsedDataForJsonStringField } from "@mzawadie/utils/richText/misc";
import {
    AttributeValueDelete,
    AttributeValueDeleteVariables,
} from "@mzawadie/views/attributes/types/AttributeValueDelete";
import {
    getAttributesAfterFileAttributesUpdate,
    mergeAttributeValueDeleteErrors,
    mergeFileUploadErrors,
} from "@mzawadie/views/attributes/utils/data";
import {
    handleDeleteMultipleAttributeValues,
    handleUploadMultipleFiles,
    prepareAttributesInput,
} from "@mzawadie/views/attributes/utils/handlers";
import { ChannelData } from "@mzawadie/views/channels/utils";
import { ProductUpdatePageSubmitData } from "@mzawadie/views/products/components/ProductUpdatePage";
import {
    ProductChannelListingUpdate,
    ProductChannelListingUpdateVariables,
} from "@mzawadie/views/products/types/ProductChannelListingUpdate";
import {
    ProductDetails_product,
    ProductDetails_product_variants,
} from "@mzawadie/views/products/types/ProductDetails";
import { ProductMediaCreateVariables } from "@mzawadie/views/products/types/ProductMediaCreate";
import { ProductMediaReorderVariables } from "@mzawadie/views/products/types/ProductMediaReorder";
import { ProductUpdate, ProductUpdateVariables } from "@mzawadie/views/products/types/ProductUpdate";
import {
    ProductVariantChannelListingUpdate,
    ProductVariantChannelListingUpdateVariables,
} from "@mzawadie/views/products/types/ProductVariantChannelListingUpdate";
import { ProductVariantCreateData_product } from "@mzawadie/views/products/types/ProductVariantCreateData";
import { ProductVariantDetails_productVariant_product } from "@mzawadie/views/products/types/ProductVariantDetails";
import { ProductVariantReorderVariables } from "@mzawadie/views/products/types/ProductVariantReorder";
import {
    SimpleProductUpdate,
    SimpleProductUpdateVariables,
} from "@mzawadie/views/products/types/SimpleProductUpdate";
import { VariantCreate, VariantCreateVariables } from "@mzawadie/views/products/types/VariantCreate";
import { mapFormsetStockToStockInput } from "@mzawadie/views/products/utils/data";
import { arrayMove } from "react-sortable-hoc";

import {
    getChannelsVariables,
    getSimpleChannelsVariables,
    getSimpleProductErrors,
    getSimpleProductVariables,
    getVariantChannelsInput,
} from "./utils";

type SubmitErrors = Array<
    | ProductErrorFragment
    | StockErrorFragment
    | BulkStockErrorFragment
    | AttributeErrorFragment
    | UploadErrorFragment
    | ProductChannelListingErrorFragment
>;

export function createUpdateHandler(
    product: ProductDetails_product,
    allChannels: ChannelData[],
    uploadFile: (variables: FileUploadVariables) => Promise<FetchResult<FileUpload>>,
    updateProduct: (variables: ProductUpdateVariables) => Promise<FetchResult<ProductUpdate>>,
    updateSimpleProduct: (
        variables: SimpleProductUpdateVariables
    ) => Promise<FetchResult<SimpleProductUpdate>>,
    updateChannels: (options: {
        variables: ProductChannelListingUpdateVariables;
    }) => Promise<FetchResult<ProductChannelListingUpdate>>,
    updateVariantChannels: (options: {
        variables: ProductVariantChannelListingUpdateVariables;
    }) => Promise<FetchResult<ProductVariantChannelListingUpdate>>,
    productVariantCreate: (options: {
        variables: VariantCreateVariables;
    }) => Promise<FetchResult<VariantCreate>>,
    deleteAttributeValue: (
        variables: AttributeValueDeleteVariables
    ) => Promise<FetchResult<AttributeValueDelete>>
) {
    return async (data: ProductUpdatePageSubmitData) => {
        let errors: SubmitErrors = [];

        const uploadFilesResult = await handleUploadMultipleFiles(
            data.attributesWithNewFileValue,
            uploadFile
        );

        const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
            data.attributesWithNewFileValue,
            product?.attributes,
            deleteAttributeValue
        );

        errors = [
            ...errors,
            ...mergeFileUploadErrors(uploadFilesResult),
            ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
        ];
        const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
            data.attributesWithNewFileValue,
            uploadFilesResult
        );

        const productVariables: ProductUpdateVariables = {
            id: product.id,
            input: {
                attributes: prepareAttributesInput({
                    attributes: data.attributes,
                    updatedFileAttributes,
                }),
                category: data.category,
                chargeTaxes: data.chargeTaxes,
                collections: data.collections,
                description: getParsedDataForJsonStringField(data.description),
                name: data.name,
                rating: data.rating,
                seo: {
                    description: data.seoDescription,
                    title: data.seoTitle,
                },
                slug: data.slug,
                taxCode: data.changeTaxCode ? data.taxCode : null,
            },
            firstValues: VALUES_PAGINATE_BY,
        };

        if (product.productType.hasVariants) {
            const result = await updateProduct(productVariables);
            errors = [...errors, ...result.data.productUpdate.errors];

            await updateChannels(getChannelsVariables(product, allChannels, data));
        } else if (!product.variants.length) {
            const productVariantResult = await productVariantCreate({
                variables: {
                    input: {
                        attributes:
                            product.productType.variantAttributes?.map((attribute) => ({
                                id: attribute.id,
                                values: attribute.choices.edges.map((value) => value.node.slug),
                            })) || [],
                        product: product.id,
                        sku: data.sku,
                        stocks: data.updateStocks.map(mapFormsetStockToStockInput),
                    },
                },
            });
            errors = [...errors, ...productVariantResult.data.productVariantCreate.errors];

            const variantId = productVariantResult.data.productVariantCreate?.productVariant?.id;

            if (variantId) {
                updateVariantChannels({
                    variables: {
                        id: variantId,
                        input: getVariantChannelsInput(data),
                    },
                });

                await updateChannels(getChannelsVariables(product, allChannels, data));

                const result = await updateSimpleProduct(
                    getSimpleProductVariables(productVariables, data, variantId)
                );
                errors = [...errors, ...getSimpleProductErrors(result.data)];
            }
        } else {
            const result = await updateSimpleProduct(
                getSimpleProductVariables(productVariables, data, product.variants[0].id)
            );
            errors = [...errors, ...getSimpleProductErrors(result.data)];

            await updateChannels(getSimpleChannelsVariables(data, product));

            updateVariantChannels({
                variables: {
                    id: product.variants[0].id,
                    input: getVariantChannelsInput(data),
                },
            });
        }

        return errors;
    };
}

export function createImageUploadHandler(
    id: string,
    createProductImage: (variables: ProductMediaCreateVariables) => void
) {
    return (file: File) =>
        createProductImage({
            alt: "",
            image: file,
            product: id,
        });
}

export function createImageReorderHandler(
    product: ProductDetails_product,
    reorderProductImages: (variables: ProductMediaReorderVariables) => void
) {
    return ({ newIndex, oldIndex }: ReorderEvent) => {
        let ids = product.media.map((image) => image.id);
        ids = arrayMove(ids, oldIndex, newIndex);
        reorderProductImages({
            mediaIds: ids,
            productId: product.id,
        });
    };
}

function areVariantsEqual(a: ProductDetails_product_variants, b: ProductDetails_product_variants) {
    return a.id === b.id;
}

export function createVariantReorderHandler(
    product:
        | ProductDetails_product
        | ProductVariantDetails_productVariant_product
        | ProductVariantCreateData_product,
    reorderProductVariants: (variables: ProductVariantReorderVariables) => void
) {
    return ({ newIndex, oldIndex }: ReorderEvent) => {
        const oldVariantOrder = [...product.variants];

        product.variants = [
            ...move(product.variants[oldIndex], product.variants, areVariantsEqual, newIndex),
        ];

        reorderProductVariants({
            move: {
                id: oldVariantOrder[oldIndex].id,
                sortOrder: newIndex - oldIndex,
            },
            productId: product.id,
        });
    };
}
