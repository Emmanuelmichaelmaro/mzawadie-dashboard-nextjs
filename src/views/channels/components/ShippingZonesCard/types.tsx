import { FetchMoreProps } from "@mzawadie/core";
import { ChannelShippingZones } from "@mzawadie/views/channels/pages/ChannelDetailsPage/types";
import { SearchShippingZones_search_edges_node } from "@mzawadie/views/searches/types/SearchShippingZones";

export interface ShippingZonesProps {
    addShippingZone: (id: string) => void;
    removeShippingZone: (id: string) => void;
    searchShippingZones: (searchPhrase: string) => void;
    fetchMoreShippingZones: FetchMoreProps;
    shippingZones: ChannelShippingZones;
    shippingZonesChoices: SearchShippingZones_search_edges_node[];
}
