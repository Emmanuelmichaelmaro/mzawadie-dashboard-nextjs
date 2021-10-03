import { SaleType } from "./../../types/globalTypes";
export interface SaleFragment_metadata {
    __typename: "MetadataItem";
    key: string;
    value: string;
}
export interface SaleFragment_privateMetadata {
    __typename: "MetadataItem";
    key: string;
    value: string;
}
export interface SaleFragment_channelListings_channel {
    __typename: "Channel";
    id: string;
    name: string;
    currencyCode: string;
}
export interface SaleFragment_channelListings {
    __typename: "SaleChannelListing";
    id: string;
    channel: SaleFragment_channelListings_channel;
    discountValue: number;
    currency: string;
}
export interface SaleFragment {
    __typename: "Sale";
    metadata: (SaleFragment_metadata | null)[];
    privateMetadata: (SaleFragment_privateMetadata | null)[];
    id: string;
    name: string;
    type: SaleType;
    startDate: any;
    endDate: any | null;
    channelListings: SaleFragment_channelListings[] | null;
}
