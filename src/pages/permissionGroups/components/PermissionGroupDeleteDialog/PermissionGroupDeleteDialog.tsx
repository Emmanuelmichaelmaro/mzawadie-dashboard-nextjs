// @ts-nocheck
import { DialogContentText, Typography } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { PermissionGroupErrorFragment } from "@mzawadie/fragments/types/PermissionGroupErrorFragment";
import { PermissionGroupErrorCode } from "@mzawadie/types/globalTypes";
import getPermissionGroupErrorMessage from "@mzawadie/utils/errors/permissionGroups";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PermissionDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    error?: PermissionGroupErrorFragment;
    name: string;
    onClose: () => void;
    onConfirm: () => void;
    open: boolean;
}

const PermissionGroupDeleteDialog: React.FC<PermissionDeleteDialogProps> = ({
    confirmButtonState,
    error,
    name,
    onClose,
    onConfirm,
    open,
}) => {
    const intl = useIntl();

    let errorMessage;
    if (error?.code === PermissionGroupErrorCode.OUT_OF_SCOPE_PERMISSION) {
        errorMessage = intl.formatMessage({
            defaultMessage: "Cant's delete group which is out of your permission scope",
            id: "O22NIZ",
            description: "deletion error message",
        });
    } else if (!!error) {
        errorMessage = getPermissionGroupErrorMessage(error, intl);
    }

    return (
        <ActionDialog
            open={open}
            confirmButtonState={confirmButtonState}
            onClose={onClose}
            onConfirm={onConfirm}
            title={intl.formatMessage({
                defaultMessage: "Delete permission group",
                id: "L6+p8a",
                description: "dialog title",
            })}
            variant="delete"
        >
            <DialogContentText>
                <FormattedMessage
                    defaultMessage="Are you sure you want to delete {name}?"
                    id="sR0urA"
                    description="dialog content"
                    values={{
                        name: <strong>{name}</strong>,
                    }}
                />
            </DialogContentText>
            {!!errorMessage && <Typography color="error">{errorMessage}</Typography>}
        </ActionDialog>
    );
};

PermissionGroupDeleteDialog.displayName = "PermissionGroupDeleteDialog";

export default PermissionGroupDeleteDialog;
