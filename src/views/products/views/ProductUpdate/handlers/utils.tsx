// @ts-nocheck
import { weight } from "@mzawadie/core";
import { ProductChannelListingAddInput } from "@mzawadie/types/globalTypes";
import { arrayDiff } from "@mzawadie/utils/arrays";
import { ChannelData, createSortedChannelsDataFromProduct } from "@mzawadie/views/channels/utils";
import { getById } from "@mzawadie/views/orders/components/OrderReturnPage/utils";
import { ProductUpdatePageSubmitData } from "@mzawadie/views/products/components/ProductUpdatePage";
import { ProductUpdateSubmitData } from "@mzawadie/views/products/components/ProductUpdatePage/form";
import {
    ProductDetails_product,
    ProductDetails_product_variants,
} from "@mzawadie/views/products/types/ProductDetails";
import { mapFormsetStockToStockInput } from "@mzawadie/views/products/utils/data";
import { getAvailabilityVariables } from "@mzawadie/views/products/utils/handlers";
import isEqual from "lodash/isEqual";

import { ProductUpdateVariables } from "../../../types/ProductUpdate";
import { SimpleProductUpdate } from "../../../types/SimpleProductUpdate";
import { ChannelsWithVariantsData, ChannelWithVariantData } from "../types";
import { getParsedChannelsWithVariantsDataFromChannels } from "../utils";

export const getSimpleProductVariables = (
    productVariables: ProductUpdateVariables,
    data: ProductUpdatePageSubmitData,
    productId: string
) => ({
    ...productVariables,
    addStocks: data.addStocks.map(mapFormsetStockToStockInput),
    deleteStocks: data.removeStocks,
    input: {
        ...productVariables.input,
        weight: weight(data.weight),
    },
    productVariantId: productId,
    productVariantInput: {
        sku: data.sku,
        trackInventory: data.trackInventory,
    },
    updateStocks: data.updateStocks.map(mapFormsetStockToStockInput),
});

export const getSimpleProductErrors = (data: SimpleProductUpdate) => [
    ...data.productUpdate.errors,
    ...data.productVariantStocksCreate.errors,
    ...data.productVariantStocksDelete.errors,
    ...data.productVariantStocksUpdate.errors,
];

export const getChannelListingBaseInputData = ({
    id: channelId,
    isPublished,
    publicationDate,
    isAvailableForPurchase,
    availableForPurchase,
    visibleInListings,
}: ChannelData) => ({
    channelId,
    isPublished,
    publicationDate,
    visibleInListings,
    isAvailableForPurchase,
    availableForPurchaseDate: availableForPurchase,
});

export const getChannelListingUpdateInputFromData = (
    { variantsIdsToAdd, variantsIdsToRemove }: ChannelWithVariantData,
    { selectedVariantsIds: initialSelectedVariantsIds }: ChannelWithVariantData,
    basicChannelData: ChannelData
) => ({
    ...getChannelListingBaseInputData(basicChannelData),
    addVariants: arrayDiff(initialSelectedVariantsIds, variantsIdsToAdd).added,
    removeVariants: variantsIdsToRemove,
});

const getParsedChannelsData = (
    channelsWithVariants: ChannelsWithVariantsData,
    initialChannelWithVariants: ChannelsWithVariantsData,
    channelsData: ChannelData[]
): ProductChannelListingAddInput[] =>
    channelsData.map(({ id, ...rest }) =>
        getChannelListingUpdateInputFromData(channelsWithVariants[id], initialChannelWithVariants[id], {
            id,
            ...rest,
        })
    );

const shouldRemoveChannel =
    (allVariants: ProductDetails_product_variants[]) =>
    ({ removeVariants }: ProductChannelListingAddInput) =>
        isRemovingAllVariants(allVariants, removeVariants);

const isRemovingAllVariants = (
    allVariants: ProductDetails_product_variants[],
    removeVariants: string[]
) => !!removeVariants.length && removeVariants.length === allVariants.length;

const shouldUpdateChannel =
    (
        initialChannelWithVariantData,
        allVariants: ProductDetails_product_variants[],
        allChannels: ChannelData[]
    ) =>
    ({ removeVariants, addVariants, channelId, ...rest }: ProductChannelListingAddInput) => {
        const initialDataInput = getChannelListingUpdateInputFromData(
            initialChannelWithVariantData[channelId],
            initialChannelWithVariantData[channelId],
            allChannels.find(getById(channelId))
        );

        const hasDataChanged = !isEqual(
            { removeVariants, addVariants, channelId, ...rest },
            initialDataInput
        );

        const isRemovingChannel = isRemovingAllVariants(allVariants, removeVariants);

        return hasDataChanged && !isRemovingChannel;
    };

export const getChannelsVariables = (
    { id, variants }: ProductDetails_product,
    allChannels: ChannelData[],
    { channelsWithVariants, channelsData }: ProductUpdateSubmitData
) => {
    const initialChannelWithVariants = getParsedChannelsWithVariantsDataFromChannels(channelsData);

    const channelsToBeUpdated = getParsedChannelsData(
        channelsWithVariants,
        initialChannelWithVariants,
        channelsData
    ).filter(shouldUpdateChannel(initialChannelWithVariants, variants, allChannels));

    const channelsIdsToBeRemoved = getParsedChannelsData(
        channelsWithVariants,
        initialChannelWithVariants,
        channelsData
    )
        .filter(shouldRemoveChannel(variants))
        .map(({ channelId }) => channelId);

    return {
        variables: {
            id,
            input: {
                updateChannels: channelsToBeUpdated,
                removeChannels: channelsIdsToBeRemoved,
            },
        },
    };
};

export const getSimpleChannelsVariables = (
    data: ProductUpdatePageSubmitData,
    product: ProductDetails_product
) => {
    const productChannels = createSortedChannelsDataFromProduct(product);
    const existingChannelIDs = productChannels.map((channel) => channel.id);
    const modifiedChannelIDs = data.channelListings.map((channel) => channel.id);

    const removedChannelIDs = existingChannelIDs.filter((x) => !modifiedChannelIDs.includes(x));

    return {
        variables: {
            id: product.id,
            input: {
                updateChannels: getAvailabilityVariables(data.channelListings),
                removeChannels: removedChannelIDs,
            },
        },
    };
};

export const getVariantChannelsInput = ({ channelListings }: ProductUpdatePageSubmitData) =>
    channelListings.map((listing) => ({
        channelId: listing.id,
        costPrice: listing.costPrice || null,
        price: listing.price,
    }));
