export interface ChannelListingProductWithoutPricingFragment_channel {
    __typename: "Channel";
    id: string;
    name: string;
    currencyCode: string;
}
export interface ChannelListingProductWithoutPricingFragment {
    __typename: "ProductChannelListing";
    isPublished: boolean;
    publicationDate: any | null;
    isAvailableForPurchase: boolean | null;
    availableForPurchase: any | null;
    visibleInListings: boolean;
    channel: ChannelListingProductWithoutPricingFragment_channel;
}
