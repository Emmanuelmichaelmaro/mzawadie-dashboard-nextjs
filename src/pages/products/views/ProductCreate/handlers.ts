// @ts-nocheck
import { FetchResult } from "@apollo/client";
import { weight } from "@mzawadie/core";
import {
    AttributeErrorFragment,
    FileUploadMutation,
    FileUploadMutationVariables,
    ProductChannelListingUpdateMutation,
    ProductChannelListingUpdateMutationVariables,
    ProductCreateMutation,
    ProductCreateMutationVariables,
    ProductDeleteMutation,
    ProductDeleteMutationVariables,
    ProductTypeQuery,
    ProductVariantChannelListingUpdateMutation,
    ProductVariantChannelListingUpdateMutationVariables,
    UploadErrorFragment,
    VariantCreateMutation,
    VariantCreateMutationVariables,
} from "@mzawadie/graphql";
import {
    getAttributesAfterFileAttributesUpdate,
    mergeFileUploadErrors,
} from "@mzawadie/pages/attributes/utils/data";
import {
    handleUploadMultipleFiles,
    prepareAttributesInput,
} from "@mzawadie/pages/attributes/utils/handlers";
import { ChannelData } from "@mzawadie/pages/channels/utils";
import { ProductCreateData } from "@mzawadie/pages/products/components/ProductCreatePage/form";
import { getAvailabilityVariables } from "@mzawadie/pages/products/utils/handlers";
import { getParsedDataForJsonStringField } from "@mzawadie/utils/richText/misc";

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
        preorder: formData.isPreorder
            ? {
                  globalThreshold: formData.globalThreshold
                      ? parseInt(formData.globalThreshold, 10)
                      : null,
                  endDate: formData.preorderEndDateTime || null,
              }
            : null,
        trackInventory: formData.trackInventory,
    },
});

export function createHandler(
    productType: ProductTypeQuery["productType"],
    uploadFile: (variables: FileUploadMutationVariables) => Promise<FetchResult<FileUploadMutation>>,
    productCreate: (
        variables: ProductCreateMutationVariables
    ) => Promise<FetchResult<ProductCreateMutation>>,
    productVariantCreate: (
        variables: VariantCreateMutationVariables
    ) => Promise<FetchResult<VariantCreateMutation>>,
    updateChannels: (options: {
        variables: ProductChannelListingUpdateMutationVariables;
    }) => Promise<FetchResult<ProductChannelListingUpdateMutation>>,
    updateVariantChannels: (options: {
        variables: ProductVariantChannelListingUpdateMutationVariables;
    }) => Promise<FetchResult<ProductVariantChannelListingUpdateMutation>>,
    productDelete: (options: {
        variables: ProductDeleteMutationVariables;
    }) => Promise<FetchResult<ProductDeleteMutation>>
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

        const productVariables: ProductCreateMutationVariables = {
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
            return { errors };
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

            if (result.data?.productChannelListingUpdate?.errors.length > 0) {
                hasErrors = true;
            }
        }

        /*
         INFO: This is a stop-gap solution, where we delete products that didn't meet
         all required data in the create form A more robust solution would require
         merging create and update form into one to persist form state across redirects
        */
        if (productId && hasErrors) {
            await productDelete({ variables: { id: productId } });

            return { errors };
        }
        return { id: productId || null, errors };
    };
}
