/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { weight } from "@mzawadie/core";
import { FileUpload, FileUploadVariables } from "@mzawadie/core/files/types/FileUpload";
import { AttributeErrorFragment } from "@mzawadie/fragments/types/AttributeErrorFragment";
import { UploadErrorFragment } from "@mzawadie/fragments/types/UploadErrorFragment";
import { getParsedDataForJsonStringField } from "@mzawadie/utils/richText/misc";
import {
    getAttributesAfterFileAttributesUpdate,
    mergeFileUploadErrors,
} from "@mzawadie/views/attributes/utils/data";
import {
    handleUploadMultipleFiles,
    prepareAttributesInput,
} from "@mzawadie/views/attributes/utils/handlers";
import { ChannelData } from "@mzawadie/views/channels/utils";
import { ProductCreateData } from "@mzawadie/views/products/components/ProductCreatePage/form";
import {
    ProductChannelListingUpdate,
    ProductChannelListingUpdateVariables,
} from "@mzawadie/views/products/types/ProductChannelListingUpdate";
import { ProductCreate, ProductCreateVariables } from "@mzawadie/views/products/types/ProductCreate";
import { ProductDelete, ProductDeleteVariables } from "@mzawadie/views/products/types/ProductDelete";
import { ProductType_productType } from "@mzawadie/views/products/types/ProductType";
import {
    ProductVariantChannelListingUpdate,
    ProductVariantChannelListingUpdateVariables,
} from "@mzawadie/views/products/types/ProductVariantChannelListingUpdate";
import { VariantCreate, VariantCreateVariables } from "@mzawadie/views/products/types/VariantCreate";
import { getAvailabilityVariables } from "@mzawadie/views/products/utils/handlers";

const getChannelsVariables = (productId: string, channels: ChannelData[]) => ({
    variables: {
        id: productId,
        input: {
            updateChannels: getAvailabilityVariables(channels),
        },
    },
});

const getSimpleProductVariables = (formData: ProductCreateData, productId: string) => ({
    input: {
        attributes: [],
        product: productId,
        sku: formData.sku,
        stocks: formData.stocks?.map((stock) => ({
            quantity: parseInt(stock.value, 10),
            warehouse: stock.id,
        })),
        trackInventory: formData.trackInventory,
    },
});

export function createHandler(
    productType: ProductType_productType,
    uploadFile: (variables: FileUploadVariables) => Promise<FetchResult<FileUpload>>,
    productCreate: (variables: ProductCreateVariables) => Promise<FetchResult<ProductCreate>>,
    productVariantCreate: (variables: VariantCreateVariables) => Promise<FetchResult<VariantCreate>>,
    updateChannels: (options: {
        variables: ProductChannelListingUpdateVariables;
    }) => Promise<FetchResult<ProductChannelListingUpdate>>,
    updateVariantChannels: (options: {
        variables: ProductVariantChannelListingUpdateVariables;
    }) => Promise<FetchResult<ProductVariantChannelListingUpdate>>,
    productDelete: (options: {
        variables: ProductDeleteVariables;
    }) => Promise<FetchResult<ProductDelete>>
) {
    return async (formData: ProductCreateData) => {
        let errors: Array<AttributeErrorFragment | UploadErrorFragment> = [];

        const uploadFilesResult = await handleUploadMultipleFiles(
            formData.attributesWithNewFileValue,
            uploadFile
        );

        errors = [...errors, ...mergeFileUploadErrors(uploadFilesResult)];
        const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
            formData.attributesWithNewFileValue,
            uploadFilesResult
        );

        const productVariables: ProductCreateVariables = {
            input: {
                attributes: prepareAttributesInput({
                    attributes: formData.attributes,
                    updatedFileAttributes,
                }),
                category: formData.category,
                chargeTaxes: formData.chargeTaxes,
                collections: formData.collections,
                description: getParsedDataForJsonStringField(formData.description),
                name: formData.name,
                productType: formData.productType?.id,
                rating: formData.rating,
                seo: {
                    description: formData.seoDescription,
                    title: formData.seoTitle,
                },
                slug: formData.slug,
                taxCode: formData.changeTaxCode ? formData.taxCode : undefined,
                weight: weight(formData.weight),
            },
        };

        const result = await productCreate(productVariables);
        let hasErrors = errors.length > 0;

        const { hasVariants } = productType;
        const productId = result.data?.productCreate?.product?.id;

        if (!productId) {
            return null;
        }

        if (!hasVariants) {
            const result = await Promise.all([
                updateChannels(getChannelsVariables(productId, formData.channelListings)),
                productVariantCreate(getSimpleProductVariables(formData, productId)),
            ]);
            const channelErrors = result[0].data?.productChannelListingUpdate?.errors;
            const variantErrors = result[1].data?.productVariantCreate?.errors;

            if ([...(channelErrors || []), ...(variantErrors || [])].length > 0) {
                hasErrors = true;
            }

            const variantId = result[1].data?.productVariantCreate?.productVariant?.id;
            if (variantErrors?.length === 0 && variantId) {
                updateVariantChannels({
                    variables: {
                        id: variantId,
                        input: formData.channelListings.map((listing) => ({
                            channelId: listing.id,
                            costPrice: listing.costPrice || null,
                            price: listing.price,
                        })),
                    },
                });
            }
        } else {
            const result = await updateChannels(
                getChannelsVariables(productId, formData.channelListings)
            );

            if (result?.data?.productChannelListingUpdate?.errors?.length > 0) {
                hasErrors = true;
            }
        }

        /*
       INFO: This is a stop-gap solution, where we delete products that didn't meet all required data in the create form
       A more robust solution would require merging create and update form into one to persist form state across redirects
      */
        if (productId && hasErrors) {
            await productDelete({ variables: { id: productId } });

            return null;
        }

        return productId || null;
    };
}
