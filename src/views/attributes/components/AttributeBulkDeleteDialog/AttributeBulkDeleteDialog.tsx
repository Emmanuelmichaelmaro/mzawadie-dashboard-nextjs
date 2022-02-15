import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@mzawadie/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeBulkDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    quantity: number;
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const AttributeBulkDeleteDialog: React.FC<AttributeBulkDeleteDialogProps> = ({
    confirmButtonState,
    quantity,
    onClose,
    onConfirm,
    open,
}) => {
    const intl = useIntl();

    return (
        <ActionDialog
            open={open}
            confirmButtonState={confirmButtonState}
            onClose={onClose}
            onConfirm={onConfirm}
            title={intl.formatMessage({
                defaultMessage: "Delete attributes",
                id: "rKf4LU",
                description: "dialog title",
            })}
            variant="delete"
        >
            <DialogContentText>
                <FormattedMessage
                    defaultMessage="{counter,plural,one{Are you sure you want to delete this attribute?} other{Are you sure you want to delete {displayQuantity} attributes?}}"
                    id="lG/MDw"
                    description="dialog content"
                    values={{
                        counter: quantity,
                        displayQuantity: <strong>{quantity}</strong>,
                    }}
                />
            </DialogContentText>
        </ActionDialog>
    );
};

AttributeBulkDeleteDialog.displayName = "AttributeBulkDeleteDialog";

export default AttributeBulkDeleteDialog;
