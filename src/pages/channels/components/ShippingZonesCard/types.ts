// @ts-nocheck
import { FetchMoreProps, RelayToFlat } from "@mzawadie/core";
import { SearchShippingZonesQuery } from "@mzawadie/graphql";
import { ChannelShippingZones } from "@mzawadie/pages/channels/components/ChannelDetailsPage/types";

export interface ShippingZonesProps {
    addShippingZone: (id: string) => void;
    removeShippingZone: (id: string) => void;
    searchShippingZones: (searchPhrase: string) => void;
    fetchMoreShippingZones: FetchMoreProps;
    shippingZones: ChannelShippingZones;
    shippingZonesChoices: RelayToFlat<SearchShippingZonesQuery["search"]>;
}
