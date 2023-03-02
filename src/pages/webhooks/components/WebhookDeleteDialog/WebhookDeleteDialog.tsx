import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { getStringOrPlaceholder } from "@mzawadie/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface WebhookDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    name: string;
    onClose: () => void;
    onConfirm: () => void;
}

const WebhookDeleteDialog: React.FC<WebhookDeleteDialogProps> = ({
    confirmButtonState,
    open,
    name,
    onClose,
    onConfirm,
}) => {
    const intl = useIntl();

    return (
        <ActionDialog
            confirmButtonState={confirmButtonState}
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            title={intl.formatMessage({
                defaultMessage: "Delete Webhook",
                id: "X90ElB",
                description: "dialog header",
            })}
            variant="delete"
        >
            <DialogContentText>
                {["", null].includes(name) ? (
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete this webhook?"
                        id="hS+ZjH"
                        description="delete webhook"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {name}?"
                        id="o5KXAN"
                        description="delete webhook"
                        values={{
                            name: <strong>{getStringOrPlaceholder(name)}</strong>,
                        }}
                    />
                )}
            </DialogContentText>
        </ActionDialog>
    );
};

WebhookDeleteDialog.displayName = "WebhookDeleteDialog";

export default WebhookDeleteDialog;
