// @ts-nocheck
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import { ConfirmButton, ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { buttonMessages, DialogProps } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/graphql";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAccountErrorMessage from "@mzawadie/utils/errors/account";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordResetDialogFormData {
    newPassword: string;
    oldPassword: string;
}

export interface StaffPasswordResetDialogProps extends DialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: AccountErrorFragment[];
    onSubmit: (data: StaffPasswordResetDialogFormData) => void;
}

const initialForm: StaffPasswordResetDialogFormData = {
    newPassword: "",
    oldPassword: "",
};

const StaffPasswordResetDialog: React.FC<StaffPasswordResetDialogProps> = ({
    confirmButtonState,
    errors,
    open,
    onClose,
    onSubmit,
}) => {
    const intl = useIntl();

    const dialogErrors = useModalDialogErrors(errors, open);

    const formErrors = getFormErrors(["oldPassword", "newPassword"], dialogErrors);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Change Password"
                    id="+kb2lM"
                    description="dialog header"
                />
            </DialogTitle>

            <Form initial={initialForm} onSubmit={onSubmit}>
                {({ change, data, submit }) => (
                    <>
                        <DialogContent>
                            <TextField
                                error={!!formErrors.oldPassword}
                                fullWidth
                                helperText={getAccountErrorMessage(formErrors.oldPassword, intl)}
                                label={intl.formatMessage({
                                    defaultMessage: "Previous Password",
                                    id: "GXdwyR",
                                    description: "input label",
                                })}
                                name="oldPassword"
                                type="password"
                                onChange={change}
                            />

                            <FormSpacer />

                            <TextField
                                error={!!formErrors.newPassword}
                                fullWidth
                                helperText={
                                    getAccountErrorMessage(formErrors.newPassword, intl) ||
                                    intl.formatMessage({
                                        defaultMessage:
                                            "New password must be at least 8 characters long",
                                        id: "qEJT8e",
                                    })
                                }
                                label={intl.formatMessage({
                                    defaultMessage: "New Password",
                                    id: "cMFlOp",
                                    description: "input label",
                                })}
                                name="newPassword"
                                type="password"
                                onChange={change}
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={onClose}>
                                <FormattedMessage {...buttonMessages.back} />
                            </Button>
                            <ConfirmButton
                                disabled={data.newPassword.length < 8}
                                transitionState={confirmButtonState}
                                color="primary"
                                variant="contained"
                                type="submit"
                                onClick={submit}
                            >
                                <FormattedMessage {...buttonMessages.save} />
                            </ConfirmButton>
                        </DialogActions>
                    </>
                )}
            </Form>
        </Dialog>
    );
};

StaffPasswordResetDialog.displayName = "StaffPasswordResetDialog";

export default StaffPasswordResetDialog;
