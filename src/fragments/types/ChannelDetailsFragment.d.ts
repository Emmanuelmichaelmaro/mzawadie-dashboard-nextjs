export interface ChannelDetailsFragment {
    __typename: "Channel";
    id: string;
    isActive: boolean;
    name: string;
    slug: string;
    currencyCode: string;
    hasOrders: boolean;
}
