import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { getStringOrPlaceholder } from "@mzawadie/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AppActivateDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    name: string;
    onClose: () => void;
    onConfirm: () => void;
}

const AppActivateDialog: React.FC<AppActivateDialogProps> = ({
    confirmButtonState,
    open,
    name,
    onClose,
    onConfirm,
}) => {
    const intl = useIntl();

    return (
        <ActionDialog
            confirmButtonLabel={intl.formatMessage({
                defaultMessage: "Activate",
                id: "D3E2b5",
                description: "button label",
            })}
            confirmButtonState={confirmButtonState}
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            title={intl.formatMessage({
                defaultMessage: "Activate App",
                id: "YHNozE",
                description: "dialog header",
            })}
            variant="default"
        >
            <DialogContentText>
                {["", null].includes(name) ? (
                    <FormattedMessage
                        defaultMessage="Are you sure you want to activate this app? Activating will start gathering events."
                        id="Q47ovw"
                        description="activate app"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Are you sure you want to activate {name}? Activating will start gathering events."
                        id="JbUg2b"
                        description="activate app"
                        values={{
                            name: <strong>{getStringOrPlaceholder(name)}</strong>,
                        }}
                    />
                )}
            </DialogContentText>
        </ActionDialog>
    );
};

AppActivateDialog.displayName = "AppActivateDialog";

export default AppActivateDialog;
