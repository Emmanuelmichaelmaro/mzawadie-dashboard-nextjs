import { CollectionList_collections_edges_node_channelListings } from "@mzawadie/pages/collections/types/CollectionList";
import { PillColor } from "@saleor/macaw-ui";
import { MessageDescriptor } from "react-intl";

import { Pill } from "../ChannelsAvailabilityMenuContent";
import { channelStatusMessages } from "./messages";

export type CollectionChannels = Pick<
    CollectionList_collections_edges_node_channelListings,
    "isPublished" | "publicationDate" | "channel"
>;
export type Channels = Pick<CollectionList_collections_edges_node_channelListings, "channel">;

export const isActive = (channelData: CollectionChannels) => channelData?.isPublished;
export const isScheduled = (channelData: CollectionChannels) =>
    channelData?.publicationDate && !channelData?.isPublished;

export const getDropdownColor = (channels: CollectionChannels[]) => {
    if (channels.some(isActive)) {
        return "success";
    }
    if (channels.some(isScheduled)) {
        return "warning";
    }
    return "error";
};

export const getChannelAvailabilityColor = (channelData: CollectionChannels): PillColor => {
    if (isActive(channelData)) {
        return "success";
    }
    if (isScheduled(channelData)) {
        return "warning";
    }
    return "error";
};

export const getChannelAvailabilityLabel = (channelData: CollectionChannels): MessageDescriptor => {
    if (isActive(channelData)) {
        return channelStatusMessages.published;
    }
    if (isScheduled(channelData)) {
        return channelStatusMessages.scheduled;
    }
    return channelStatusMessages.unpublished;
};

export const mapChannelsToPills = (channelData: CollectionChannels[]): Pill[] =>
    channelData.map((channel) => ({
        channel: channel.channel,
        color: getChannelAvailabilityColor(channel),
        label: getChannelAvailabilityLabel(channel),
    }));
