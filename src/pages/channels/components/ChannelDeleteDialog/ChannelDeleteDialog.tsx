import { Typography } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { Choices, SingleSelectField } from "@mzawadie/components/SingleSelectField";
import { buttonMessages } from "@mzawadie/core";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { useStyles } from "../styles";

const messages = defineMessages({
    deleteChannel: {
        defaultMessage: "Delete Channel",
        id: "QZoU0r",
        description: "dialog header",
    },
    deletingAllProductData: {
        defaultMessage:
            "Deleting channel will delete all product data regarding this channel. Are you sure you want to delete this channel?",
        id: "Mz0cx+",
        description: "delete channel",
    },
    needToBeMoved: {
        defaultMessage:
            "All order information from this channel need to be moved to a different channel. Please select channel orders need to be moved to:.",
        id: "sidKce",
        description: "delete channel",
    },
    noAvailableChannel: {
        defaultMessage:
            "There is no available channel to move order information to. Please create a channel with same currency so that information can be moved to it.",
        id: "BXMSl4",
        description: "currency channel",
    },
    selectChannel: {
        defaultMessage: "Select Channel",
        id: "SZJhvK",
        description: "dialog header",
    },
});

export interface ChannelDeleteDialogProps {
    channelsChoices: Choices;
    hasOrders: boolean;
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    onBack: () => void;
    onClose: () => void;
    onConfirm: (targetChannelId: string) => void;
}

const ChannelDeleteDialog: React.FC<ChannelDeleteDialogProps> = ({
    channelsChoices = [],
    hasOrders,
    confirmButtonState,
    open,
    onBack,
    onClose,
    onConfirm,
}) => {
    const classes = useStyles({});

    const intl = useIntl();

    const [choice, setChoice] = useStateFromProps(
        channelsChoices.length ? channelsChoices[0].value : ""
    );

    const hasChannels = !!channelsChoices?.length;

    const canBeDeleted = hasChannels || !hasOrders;

    return (
        <ActionDialog
            confirmButtonState={confirmButtonState}
            open={open}
            onClose={onClose}
            onConfirm={() => (canBeDeleted ? onConfirm(choice) : onBack())}
            title={intl.formatMessage(messages.deleteChannel)}
            confirmButtonLabel={intl.formatMessage(
                canBeDeleted ? buttonMessages.delete : buttonMessages.ok
            )}
            variant={canBeDeleted ? "delete" : "default"}
        >
            <div>
                {hasOrders ? (
                    hasChannels ? (
                        <>
                            <Typography>{intl.formatMessage(messages.needToBeMoved)}</Typography>

                            <div className={classes.select}>
                                <SingleSelectField
                                    choices={channelsChoices}
                                    name="channels"
                                    label={intl.formatMessage(messages.selectChannel)}
                                    value={choice}
                                    onChange={(e) => setChoice(e.target.value)}
                                />
                            </div>

                            <Typography>
                                {intl.formatMessage(messages.deletingAllProductData)}
                            </Typography>
                        </>
                    ) : (
                        <Typography>{intl.formatMessage(messages.noAvailableChannel)}</Typography>
                    )
                ) : (
                    <Typography>{intl.formatMessage(messages.deletingAllProductData)}</Typography>
                )}
            </div>
        </ActionDialog>
    );
};

ChannelDeleteDialog.displayName = "ChannelDeleteDialog";

export default ChannelDeleteDialog;
