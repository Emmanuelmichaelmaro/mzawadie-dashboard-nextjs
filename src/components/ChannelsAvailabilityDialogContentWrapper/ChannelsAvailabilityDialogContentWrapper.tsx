import { TextField, Typography } from "@material-ui/core";
import { ControlledCheckbox } from "@mzawadie/components/ControlledCheckbox";
import Hr from "@mzawadie/components/Hr";
import Label from "@mzawadie/pages/orders/components/OrderHistory/Label";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

export const useStyles = makeStyles(
    (theme) => ({
        content: {
            "& hr": {
                left: -24,
                position: "relative",
                width: "calc(100% + 48px)",
            },
        },
        contentTitle: {
            margin: theme.spacing(1, 0),
        },
        dialog: {
            marginBottom: -30,
            marginTop: theme.spacing(2),
        },
        input: {
            "& label": {
                overflowX: "inherit",
            },
        },
        notFound: {
            paddingBottom: theme.spacing(2),
        },
        scrollArea: {
            maxHeight: 400,
            overflowY: "scroll",
            overflowX: "hidden",
            marginBottom: theme.spacing(3),
        },
        text: {
            marginBottom: 5,
        },
    }),
    { name: "ChannelsAvailabilityContent" }
);

const messages = defineMessages({
    selectTitle: {
        defaultMessage: "Select channels you want for {contentType} to be available on",
        id: "7scATx",
        description: "select title",
    },
    selectAllChannelsLabel: {
        defaultMessage: "Select All Channels",
        id: "zR9Ozi",
        description: "select all channels label",
    },
    channelsAlphabeticallyTitle: {
        defaultMessage: "Channels from A to Z",
        id: "/lBLBI",
        description: "channels alphabetically title",
    },
    notFoundTitle: {
        defaultMessage: "No Channels Found",
        id: "PctLol",
        description: "no channels found title",
    },
});

export interface ChannelsAvailabilityContentProps {
    contentType?: string;
    toggleAll?: () => void;
    children: React.ReactNode;
    toggleAllLabel?: React.ReactNode;
    query: string;
    onQueryChange: (query: string) => void;
    hasAnyChannelsToDisplay: boolean;
    hasAllSelected: boolean;
}

export const ChannelsAvailabilityDialogWrapper: React.FC<ChannelsAvailabilityContentProps> = ({
    contentType = "",
    toggleAll,
    toggleAllLabel,
    children,
    hasAnyChannelsToDisplay,
    query,
    onQueryChange,
    hasAllSelected,
}) => {
    const classes = useStyles({});
    const intl = useIntl();
    const searchText = intl.formatMessage({
        defaultMessage: "Search through channels",
        id: "ybaLoZ",
    });

    return (
        <div className={classes.content}>
            {!!contentType && (
                <Typography className={classes.text} variant="caption">
                    <FormattedMessage {...messages.selectTitle} />
                </Typography>
            )}
            <TextField
                name="query"
                value={query}
                className={classes.input}
                onChange={(e) => onQueryChange(e.target.value)}
                label={searchText}
                placeholder={searchText}
                fullWidth
            />
            <div className={classes.dialog}>
                {!!toggleAll && (
                    <>
                        <ControlledCheckbox
                            checked={hasAllSelected}
                            name="allChannels"
                            label={
                                toggleAllLabel || (
                                    <Label text={intl.formatMessage(messages.selectAllChannelsLabel)} />
                                )
                            }
                            onChange={toggleAll}
                        />
                        <Hr />
                    </>
                )}
                <Typography className={classes.contentTitle}>
                    <FormattedMessage {...messages.channelsAlphabeticallyTitle} />
                </Typography>
                <div
                    className={classes.scrollArea}
                    data-test-id="manage-products-channels-availiability-list"
                >
                    {hasAnyChannelsToDisplay ? (
                        children
                    ) : (
                        <div className={classes.notFound}>
                            <FormattedMessage {...messages.notFoundTitle} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChannelsAvailabilityDialogWrapper;
