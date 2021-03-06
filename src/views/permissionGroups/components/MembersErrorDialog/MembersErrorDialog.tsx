import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@mzawadie/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface MembersErrorDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const MembersErrorDialog: React.FC<MembersErrorDialogProps> = ({
    confirmButtonState,
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
                defaultMessage: "Unassign users",
                id: "lT5MYM",
                description: "dialog title",
            })}
            variant="info"
        >
            <DialogContentText>
                <FormattedMessage
                    defaultMessage="You are not able to modify this group members. Solve this problem to continue with request."
                    id="H/o4Ex"
                    description="dialog content"
                />
            </DialogContentText>
        </ActionDialog>
    );
};
MembersErrorDialog.displayName = "MembersErrorDialog";
export default MembersErrorDialog;
