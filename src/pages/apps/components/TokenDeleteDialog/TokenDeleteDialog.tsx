import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface TokenDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
    name: string;
}

const TokenDeleteDialog: React.FC<TokenDeleteDialogProps> = ({
    name,
    confirmButtonState,
    onClose,
    onConfirm,
    open,
}) => {
    const intl = useIntl();

    return (
        <ActionDialog
            open={open}
            onClose={onClose}
            confirmButtonState={confirmButtonState}
            onConfirm={onConfirm}
            variant="delete"
            title={intl.formatMessage({
                defaultMessage: "Delete Token",
                id: "quV5zH",
                description: "dialog title",
            })}
        >
            <DialogContentText>
                <FormattedMessage
                    defaultMessage="Are you sure you want to delete token {token}?"
                    id="2VSP8C"
                    description="delete token"
                    values={{
                        token: <strong>{name}</strong>,
                    }}
                />
            </DialogContentText>
        </ActionDialog>
    );
};

TokenDeleteDialog.displayName = "TokenDeleteDialog";

export default TokenDeleteDialog;
