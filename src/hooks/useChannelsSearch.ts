import { FetchMoreProps, Search, SearchProps } from "@mzawadie/core";
import { ChannelDetailsFragment } from "@mzawadie/graphql";
import { filter } from "fuzzaldrin";
import React from "react";

export const useChannelsSearch = function <T extends { name: string }>(channels: T[]) {
    const [query, onQueryChange] = React.useState("");
    const filteredChannels = filter<T, "name">(channels, query, { key: "name" }) || [];

    return { query, onQueryChange, filteredChannels };
};

export interface ChannelsWithLoadMoreProps extends FetchMoreProps, Search, SearchProps {
    channels: ChannelDetailsFragment[];
}
