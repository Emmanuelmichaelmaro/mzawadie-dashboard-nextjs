// @ts-nocheck
import { Card, Popper } from "@material-ui/core";
import { ChannelsAvailabilityMenuContent } from "@mzawadie/components/ChannelsAvailabilityMenuContent";
import { PluginBaseFragment } from "@mzawadie/graphql";
import { isPluginGlobal } from "@mzawadie/pages/plugins/views/utils";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { mapPluginsToPills } from "../utils";
import GlobalConfigPluginPopupBody from "./GlobalConfigPluginPopupBody";

const useStyles = makeStyles(
    () => ({
        container: {
            maxWidth: 500,
            zIndex: 1000,
        },
    }),
    { name: "PluginChannelsAvailabilityStatusPopup" }
);

interface PluginAvailabilityStatusPopupProps {
    plugin: PluginBaseFragment;
    isOpen: boolean;
    anchor: React.RefObject<HTMLTableCellElement>;
}

const PluginAvailabilityStatusPopup: React.FC<PluginAvailabilityStatusPopupProps> = ({
    plugin,
    isOpen,
    anchor,
}) => {
    const classes = useStyles({});

    const isGlobalPlugin = isPluginGlobal(plugin.globalConfiguration);

    return (
        <Popper placement="left" open={isOpen} className={classes.container} anchorEl={anchor.current}>
            <Card elevation={8}>
                {isGlobalPlugin ? (
                    <GlobalConfigPluginPopupBody plugin={plugin} />
                ) : (
                    <ChannelsAvailabilityMenuContent
                        pills={mapPluginsToPills(plugin.channelConfigurations)}
                    />
                )}
            </Card>
        </Popper>
    );
};

export default PluginAvailabilityStatusPopup;
