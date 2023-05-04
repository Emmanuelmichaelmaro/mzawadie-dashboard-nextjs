// @ts-nocheck
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import BackButton from "@mzawadie/components/BackButton";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { buttonMessages } from "@mzawadie/core";
import { DialogProps } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAccountErrorMessage from "@mzawadie/utils/errors/account";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPasswordResetDialogFormData {
    newPassword: string;
    oldPassword: string;
}

export interface StaffPasswordResetDialogProps extends DialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: AccountErrorFragment[];
    onSubmit: (data: StaffPasswordResetDialogFormData) => SubmitPromise;
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
                    id="+kb2lM"
                    defaultMessage="Change Password"
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
                                    id: "GXdwyR",
                                    defaultMessage: "Previous Password",
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
                                        id: "qEJT8e",
                                        defaultMessage:
                                            "New password must be at least 8 characters long",
                                    })
                                }
                                label={intl.formatMessage({
                                    id: "cMFlOp",
                                    defaultMessage: "New Password",
                                    description: "input label",
                                })}
                                name="newPassword"
                                type="password"
                                onChange={change}
                            />
                        </DialogContent>

                        <DialogActions>
                            <BackButton onClick={onClose} />
                            <ConfirmButton
                                disabled={data.newPassword.length < 8}
                                transitionState={confirmButtonState}
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
