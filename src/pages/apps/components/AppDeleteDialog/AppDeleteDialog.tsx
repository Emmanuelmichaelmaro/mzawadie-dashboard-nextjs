import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { getStringOrPlaceholder } from "@mzawadie/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AppDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    name: string;
    onClose: () => void;
    onConfirm: () => void;
    type: "CUSTOM" | "EXTERNAL";
}

const AppDeleteDialog: React.FC<AppDeleteDialogProps> = ({
    confirmButtonState,
    open,
    name,
    onClose,
    onConfirm,
    type,
}) => {
    const intl = useIntl();

    return (
        <ActionDialog
            confirmButtonState={confirmButtonState}
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            title={intl.formatMessage({
                defaultMessage: "Delete App",
                id: "zQX6xO",
                description: "dialog header",
            })}
            variant="delete"
        >
            <DialogContentText>
                {["", null].includes(name) ? (
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete this app?"
                        id="6hLZNA"
                        description="delete app"
                    />
                ) : type === "EXTERNAL" ? (
                    <FormattedMessage
                        defaultMessage="Deleting {name}, you will remove installation of the app. If you are paying for app subscription, remember to unsubscribe from the app in Saleor Marketplace. Are you sure you want to delete the app?"
                        id="EWD/wU"
                        description="delete app"
                        values={{
                            name: <strong>{getStringOrPlaceholder(name)}</strong>,
                        }}
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Deleting {name}, you will delete all the data and webhooks regarding this app. Are you sure you want to do that?"
                        id="LtqrM8"
                        description="delete custom app"
                        values={{
                            name: <strong>{getStringOrPlaceholder(name)}</strong>,
                        }}
                    />
                )}
            </DialogContentText>
        </ActionDialog>
    );
};

AppDeleteDialog.displayName = "AppDeleteDialog";

export default AppDeleteDialog;
