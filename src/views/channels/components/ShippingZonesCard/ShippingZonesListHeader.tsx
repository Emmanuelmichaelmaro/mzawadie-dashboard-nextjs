import { ExpansionPanelSummary, Typography } from "@material-ui/core";
import IconChevronDown from "@mzawadie/icons/ChevronDown";
import HorizontalSpacer from "@mzawadie/views/apps/components/HorizontalSpacer";
import { ChannelShippingZones } from "@mzawadie/views/channels/pages/ChannelDetailsPage/types";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        container: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        // empty expanded needed for mui to use root styles
        expanded: {},
        root: {
            width: "100%",
            border: "none",
            marginRight: theme.spacing(1),
            paddingBottom: theme.spacing(2),
            minHeight: 0,

            "&$expanded": {
                minHeight: 0,
            },
        },
        content: {
            paddingLeft: theme.spacing(1),
            margin: 0,

            "&$expanded": {
                margin: 0,
            },
        },
    }),
    { name: "ShippingZonesListHeader" }
);

const messages = defineMessages({
    title: {
        defaultMessage: "{zonesCount} Shipping Zones",
        id: "r/gr4q",
        description: "title",
    },
});

interface ShippingZonesListHeaderProps {
    shippingZones: ChannelShippingZones;
}

const ShippingZonesListHeader: React.FC<ShippingZonesListHeaderProps> = ({ shippingZones }) => {
    const classes = useStyles({});
    const intl = useIntl();

    return (
        <div className={classes.container}>
            <ExpansionPanelSummary expandIcon={<IconChevronDown />} classes={classes}>
                <Typography variant="subtitle2" color="textSecondary">
                    {intl.formatMessage(messages.title, {
                        zonesCount: shippingZones.length,
                    })}
                </Typography>
            </ExpansionPanelSummary>
            <HorizontalSpacer spacing={1.5} />
        </div>
    );
};

export default ShippingZonesListHeader;
