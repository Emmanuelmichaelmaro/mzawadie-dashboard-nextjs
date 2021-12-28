import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@mzawadie/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface WarehouseDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
    name: string;
}

const WarehouseDeleteDialog: React.FC<WarehouseDeleteDialogProps> = ({
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
                defaultMessage: "Delete Warehouse",
                id: "ny4zrH",
                description: "dialog title",
            })}
        >
            <DialogContentText>
                <FormattedMessage
                    defaultMessage="Are you sure you want to delete {warehouseName}?"
                    id="DTL7sE"
                    description="dialog content"
                    values={{
                        warehouseName: <strong>{name}</strong>,
                    }}
                />
            </DialogContentText>
        </ActionDialog>
    );
};

WarehouseDeleteDialog.displayName = "WarehouseDeleteDialog";
export default WarehouseDeleteDialog;
