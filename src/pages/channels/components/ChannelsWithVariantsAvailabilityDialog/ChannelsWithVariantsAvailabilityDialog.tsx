// @ts-nocheck
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { useChannelsSearch } from "@mzawadie/components/ChannelsAvailabilityDialog/utils";
import { ChannelsAvailabilityDialogWrapper } from "@mzawadie/components/ChannelsAvailabilityDialogContentWrapper";
import { DialogProps } from "@mzawadie/core";
import { ProductDetailsVariantFragment } from "@mzawadie/graphql";
import { useModalDialogOpen } from "@mzawadie/hooks/useModalDialogOpen";
import { ChannelVariantListing } from "@mzawadie/pages/products/views/ProductUpdate/types";
import useChannelsWithProductVariants from "@mzawadie/pages/products/views/ProductUpdate/useChannelsWithProductVariants";
import {
    areAllVariantsAtAllChannelsSelected,
    areAnyChannelVariantsSelected,
    channelVariantListingDiffToDict,
} from "@mzawadie/pages/products/views/ProductUpdate/utils";
import React from "react";
import { useIntl, defineMessages } from "react-intl";

import { ChannelData } from "../../utils";
import ChannelsWithVariantsAvailabilityDialogContent from "./ChannelsWithVariantsAvailabilityDialogContent";

const messages = defineMessages({
    title: {
        defaultMessage: "Manage Channels",
        id: "p/EWEZ",
        description: "channels variants availability dialog title",
    },
});

export interface ChannelsAvailabilityDialogProps extends DialogProps {
    channels: ChannelData[];
    contentType?: string;
    variants: ProductDetailsVariantFragment[];
    onConfirm: (listings: ChannelVariantListing) => void;
}

export const ChannelsWithVariantsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
    channels,
    contentType,
    variants,
    open,
    onClose,
    onConfirm,
}) => {
    const intl = useIntl();

    const {
        channelsWithVariantsData,
        hasChanged,
        toggleAllChannels,
        addVariantToChannel,
        removeVariantFromChannel,
        toggleAllChannelVariants,
        channelVariantListing,
        reset,
    } = useChannelsWithProductVariants(
        channels,
        variants?.map((variant) => variant.id)
    );

    useModalDialogOpen(open, {
        onClose: reset,
    });

    const { query, onQueryChange, filteredChannels } = useChannelsSearch(channels);

    const hasAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
        variants.map((variant) => variant.id),
        channelVariantListingDiffToDict(channelsWithVariantsData)
    );

    const isChannelSelected = (channelId: string) =>
        areAnyChannelVariantsSelected(channelsWithVariantsData[channelId]);

    return (
        <ActionDialog
            confirmButtonState="default"
            open={open}
            onClose={onClose}
            onConfirm={() => onConfirm(channelVariantListing)}
            title={intl.formatMessage(messages.title)}
            disabled={!hasChanged}
        >
            <ChannelsAvailabilityDialogWrapper
                hasAllSelected={hasAllChannelsSelected}
                hasAnyChannelsToDisplay={!!filteredChannels.length}
                query={query}
                onQueryChange={onQueryChange}
                toggleAll={toggleAllChannels}
                contentType={contentType}
            >
                <ChannelsWithVariantsAvailabilityDialogContent
                    allVariants={variants}
                    channels={filteredChannels}
                    isChannelSelected={isChannelSelected}
                    channelsWithVariants={channelsWithVariantsData}
                    addVariantToChannel={addVariantToChannel}
                    removeVariantFromChannel={removeVariantFromChannel}
                    toggleAllChannelVariants={toggleAllChannelVariants}
                />
            </ChannelsAvailabilityDialogWrapper>
        </ActionDialog>
    );
};

export default ChannelsWithVariantsAvailabilityDialog;
