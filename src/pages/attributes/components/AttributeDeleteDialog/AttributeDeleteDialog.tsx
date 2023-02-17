import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
    name: string;
}

const AttributeDeleteDialog: React.FC<AttributeDeleteDialogProps> = ({
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
                defaultMessage: "Delete attribute",
                id: "JI2Xwp",
                description: "dialog title",
            })}
        >
            <DialogContentText>
                <FormattedMessage
                    defaultMessage="Are you sure you want to delete {attributeName}?"
                    id="h1rPPg"
                    description="dialog content"
                    values={{
                        attributeName: <strong>{name}</strong>,
                    }}
                />
            </DialogContentText>
        </ActionDialog>
    );
};

AttributeDeleteDialog.displayName = "AttributeDeleteDialog";

export default AttributeDeleteDialog;
