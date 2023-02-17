// @ts-nocheck
import { Typography } from "@material-ui/core";
import { HorizontalSpacer } from "@mzawadie/pages/apps/components/HorizontalSpacer";
import { CollectionList_collections_edges_node_channelListings_channel } from "@mzawadie/pages/collections/types/CollectionList";
import ScrollableContent from "@mzawadie/pages/plugins/components/PluginsList/PluginAvailabilityStatusPopup/ScrollableContent";
import { Pill, PillColor } from "@saleor/macaw-ui";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { messages } from "../ChannelsAvailabilityDropdown/messages";
import { useStyles } from "./styles";

export interface ChannelsAvailabilityMenuContentProps {
    pills: Pill[];
}
// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface Pill {
    channel: CollectionList_collections_edges_node_channelListings_channel;
    color: PillColor;
    label: MessageDescriptor;
}

export const ChannelsAvailabilityMenuContent: React.FC<ChannelsAvailabilityMenuContentProps> = ({
    pills,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    return (
        <div className={classes.menuContainer}>
            <div className={classes.row}>
                <Typography variant="caption" className={classes.caption}>
                    {intl.formatMessage(messages.channel)}
                </Typography>
                <Typography variant="caption" className={classes.caption}>
                    {intl.formatMessage(messages.status)}
                </Typography>
            </div>
            <ScrollableContent>
                {pills.map((pill) => (
                    <div key={pill.channel.id} className={classes.row}>
                        <Typography>{pill.channel.name}</Typography>
                        <HorizontalSpacer spacing={4} />
                        <Pill label={intl.formatMessage(pill.label)} color={pill.color} />
                    </div>
                ))}
            </ScrollableContent>
        </div>
    );
};

ChannelsAvailabilityMenuContent.displayName = "ChannelsAvailabilityMenuContent";

export default ChannelsAvailabilityMenuContent;
