// @ts-nocheck
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { ChannelData } from "@mzawadie/pages/channels/utils";
import { arrayDiff } from "@mzawadie/utils/arrays";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";

import { ChannelsWithVariantsData } from "./types";
import { createFromChannels, createUpdatedChannels } from "./utils";

function useChannelVariantListings(channels: ChannelData[]) {
    const initialChannelVariantListing = useMemo(
        () => createFromChannels(channels, ({ variantsIds }) => variantsIds),
        [channels]
    );

    const [updatedChannelVariantListing, setUpdatedChannelVariantListing] = useStateFromProps(
        initialChannelVariantListing
    );

    const hasChanged = useMemo(
        () => !isEqual(initialChannelVariantListing, updatedChannelVariantListing),
        [initialChannelVariantListing, updatedChannelVariantListing]
    );

    const channelsWithVariantsData = useMemo<ChannelsWithVariantsData>(
        () =>
            createFromChannels(channels, (channel) => {
                const diff = arrayDiff(
                    initialChannelVariantListing[channel.id],
                    updatedChannelVariantListing[channel.id]
                );

                return {
                    selectedVariantsIds: updatedChannelVariantListing[channel.id],
                    variantsIdsToAdd: diff.added,
                    variantsIdsToRemove: diff.removed,
                };
            }),
        [initialChannelVariantListing, updatedChannelVariantListing]
    );

    const reset = () => setUpdatedChannelVariantListing(initialChannelVariantListing);

    const updatedChannels: ChannelData[] = useMemo(
        () => createUpdatedChannels(channels, updatedChannelVariantListing),
        [channels, updatedChannelVariantListing]
    );

    return {
        channels: updatedChannels,
        channelsWithVariantsData,
        channelVariantListing: updatedChannelVariantListing,
        setChannelVariantListing: setUpdatedChannelVariantListing,
        hasChanged,
        reset,
    };
}

export default useChannelVariantListings;
