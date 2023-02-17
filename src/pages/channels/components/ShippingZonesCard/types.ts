import { FetchMoreProps } from "@mzawadie/core";
import { ChannelShippingZones } from "@mzawadie/pages/channels/components/ChannelDetailsPage/types";
import { SearchShippingZones_search_edges_node } from "@mzawadie/searches/types/SearchShippingZones";

export interface ShippingZonesProps {
    addShippingZone: (id: string) => void;
    removeShippingZone: (id: string) => void;
    searchShippingZones: (searchPhrase: string) => void;
    fetchMoreShippingZones: FetchMoreProps;
    shippingZones: ChannelShippingZones;
    shippingZonesChoices: SearchShippingZones_search_edges_node[];
}
