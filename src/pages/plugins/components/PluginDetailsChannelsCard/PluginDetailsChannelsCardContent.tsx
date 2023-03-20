// @ts-nocheck
import { CardContent, Typography } from "@material-ui/core";
import { CollectionWithDividers } from "@mzawadie/components/CollectionWithDividers";
import Skeleton from "@mzawadie/components/Skeleton";
import { PluginsDetailsFragment } from "@mzawadie/graphql";
import { isPluginGlobal } from "@mzawadie/pages/plugins/views/utils";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { pluginDetailsChannelsCardMessages as messages } from "./messages";

const useStyles = makeStyles(
    (theme) => ({
        itemContainer: {
            position: "relative",
            cursor: "pointer",
        },
        itemActiveIndicator: {
            position: "absolute",
            left: 0,
            backgroundColor: theme.palette.primary.main,
            width: 2,
            height: "100%",
        },
    }),
    { name: "PluginDetailsChannelsCardContent" }
);

export interface PluginDetailsChannelsCardProps {
    setSelectedChannelId: (channelId: string) => void;
    selectedChannelId: string;
    plugin: PluginsDetailsFragment;
}

const PluginDetailsChannelsCardContent: React.FC<PluginDetailsChannelsCardProps> = ({
    plugin,
    selectedChannelId,
    setSelectedChannelId,
}) => {
    const classes = useStyles({});

    if (!plugin) {
        return (
            <CardContent>
                <Skeleton />
            </CardContent>
        );
    }

    if (isPluginGlobal(plugin.globalConfiguration)) {
        return (
            <CardContent>
                <FormattedMessage {...messages.noChannelsSubtitle} />
            </CardContent>
        );
    }

    const isChannelSelected = (channelId: string) => selectedChannelId === channelId;

    return (
        <>
            <CollectionWithDividers
                collection={plugin.channelConfigurations}
                renderItem={({ channel }) => (
                    <div
                        className={classes.itemContainer}
                        key={channel.id}
                        onClick={() => setSelectedChannelId(channel.id)}
                    >
                        {isChannelSelected(channel.id) && (
                            <div className={classes.itemActiveIndicator} />
                        )}
                        <CardContent>
                            <Typography>{channel.name}</Typography>
                        </CardContent>
                    </div>
                )}
            />
        </>
    );
};

export default PluginDetailsChannelsCardContent;
