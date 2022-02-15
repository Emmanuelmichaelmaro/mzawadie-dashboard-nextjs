// @ts-nocheck
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StatusLabel from "@mzawadie/components/StatusLabel";
import { statusLabelMessages } from "@mzawadie/components/StatusLabel/messages";
import { Plugins_plugins_edges_node } from "@mzawadie/views/plugins/types/Plugins";
import { isPluginGlobal } from "@mzawadie/views/plugins/views/utils";
import React from "react";
import { useIntl } from "react-intl";

import { pluginAvailabilityStatusMessages as messages } from "./messages";
import { getActiveChannelConfigsCount, getAllChannelConfigsCount } from "./utils";

const useStyles = makeStyles(
    () => ({
        horizontalContainer: {
            display: "flex",
            flexDirection: "row",
        },
    }),
    { name: "ChannelStatusLabel" }
);

interface PluginAvailabilityStatusProps {
    plugin: Plugins_plugins_edges_node;
}

const PluginAvailabilityStatus: React.FC<PluginAvailabilityStatusProps> = ({
    plugin: { globalConfiguration, channelConfigurations },
}) => {
    const classes = useStyles({});

    const intl = useIntl();

    const isGlobalPlugin = isPluginGlobal(globalConfiguration);

    const activeChannelsCount = getActiveChannelConfigsCount(channelConfigurations);

    const isStatusActive = isGlobalPlugin ? globalConfiguration?.active : !!activeChannelsCount;

    const globalPluginLabel = intl.formatMessage(
        isStatusActive ? statusLabelMessages.active : statusLabelMessages.deactivated
    );

    return (
        <StatusLabel
            label={
                isGlobalPlugin ? (
                    globalPluginLabel
                ) : (
                    <div className={classes.horizontalContainer}>
                        <Typography>
                            {`${intl.formatMessage(messages.channelTitle, {
                                activeChannelsCount,
                            })}/${getAllChannelConfigsCount(channelConfigurations)}`}
                        </Typography>
                    </div>
                )
            }
            status={isStatusActive ? "success" : "error"}
        />
    );
};

export default PluginAvailabilityStatus;
