import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@mzawadie/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { getStringOrPlaceholder } from "@mzawadie/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import msgs from "./messages";

export interface AppDeactivateDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    name: string;
    thirdParty?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const AppDeactivateDialog: React.FC<AppDeactivateDialogProps> = ({
    confirmButtonState,
    open,
    name,
    thirdParty = true,
    onClose,
    onConfirm,
}) => {
    const intl = useIntl();

    return (
        <ActionDialog
            confirmButtonLabel={intl.formatMessage({
                defaultMessage: "Deactivate",
                id: "W+AFZY",
                description: "button label",
            })}
            confirmButtonState={confirmButtonState}
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            title={intl.formatMessage({
                defaultMessage: "Dectivate App",
                id: "yMi8I8",
                description: "dialog header",
            })}
            variant="delete"
        >
            <DialogContentText>
                {["", null].includes(name) ? (
                    <FormattedMessage
                        {...(thirdParty ? msgs.deactivateApp : msgs.deactivateLocalApp)}
                    />
                ) : (
                    <FormattedMessage
                        {...(thirdParty ? msgs.deactivateNamedApp : msgs.deactivateLocalNamedApp)}
                        values={{
                            name: <strong>{getStringOrPlaceholder(name)}</strong>,
                        }}
                    />
                )}
            </DialogContentText>
        </ActionDialog>
    );
};

AppDeactivateDialog.displayName = "AppDeactivateDialog";

export default AppDeactivateDialog;
