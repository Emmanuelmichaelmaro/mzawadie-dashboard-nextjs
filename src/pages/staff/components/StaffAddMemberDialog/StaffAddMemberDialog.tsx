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
import { buttonMessages, commonMessages, FetchMoreProps, SearchPageProps } from "@mzawadie/core";
import { StaffErrorFragment } from "@mzawadie/fragments/types/StaffErrorFragment";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import { SearchPermissionGroups_search_edges_node } from "@mzawadie/searches/types/SearchPermissionGroups";
import { getFormErrors } from "@mzawadie/utils/errors";
import getStaffErrorMessage from "@mzawadie/utils/errors/staff";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AddMemberFormData {
    email: string;
    firstName: string;
    lastName: string;
    permissionGroups: string[];
}

const initialForm: AddMemberFormData = {
    email: "",
    firstName: "",
    lastName: "",
    permissionGroups: [],
};

const useStyles = makeStyles(
    (theme) => ({
        hr: {
            backgroundColor: "#eaeaea",
            border: "none",
            height: 1,
            marginBottom: 0,
        },
        sectionTitle: {
            fontWeight: 600 as const,
            marginBottom: theme.spacing(),
            marginTop: theme.spacing(2),
        },
        textFieldGrid: {
            display: "grid",
            gridColumnGap: theme.spacing(2),
            gridTemplateColumns: "1fr 1fr",
        },
    }),
    { name: "StaffAddMemberDialog" }
);

interface StaffAddMemberDialogProps extends SearchPageProps {
    availablePermissionGroups: SearchPermissionGroups_search_edges_node[];
    confirmButtonState: ConfirmButtonTransitionState;
    disabled: boolean;
    errors: StaffErrorFragment[];
    fetchMorePermissionGroups: FetchMoreProps;
    open: boolean;
    onClose: () => void;
    onConfirm: (data: AddMemberFormData) => void;
}

const StaffAddMemberDialog: React.FC<StaffAddMemberDialogProps> = (props) => {
    const { confirmButtonState, errors, onClose, onConfirm, open } = props;

    const classes = useStyles(props);
    const dialogErrors = useModalDialogErrors(errors, open);
    const intl = useIntl();
    const formErrors = getFormErrors(["firstName", "lastName", "email"], dialogErrors);

    return (
        <Dialog onClose={onClose} open={open}>
            <Form initial={initialForm} onSubmit={onConfirm}>
                {({ change, data: formData, hasChanged }) => (
                    <>
                        <DialogTitle>
                            <FormattedMessage
                                defaultMessage="Invite Staff Member"
                                id="23g7PY"
                                description="dialog header"
                            />
                        </DialogTitle>
                        <DialogContent>
                            <div className={classes.textFieldGrid}>
                                <TextField
                                    error={!!formErrors.firstName}
                                    helperText={
                                        !!formErrors.firstName &&
                                        getStaffErrorMessage(formErrors.firstName, intl)
                                    }
                                    label={intl.formatMessage(commonMessages.firstName)}
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={change}
                                />
                                <TextField
                                    error={!!formErrors.lastName}
                                    helperText={
                                        !!formErrors.lastName &&
                                        getStaffErrorMessage(formErrors.lastName, intl)
                                    }
                                    label={intl.formatMessage(commonMessages.lastName)}
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={change}
                                />
                            </div>
                            <FormSpacer />
                            <TextField
                                error={!!formErrors.email}
                                fullWidth
                                helperText={
                                    !!formErrors.email && getStaffErrorMessage(formErrors.email, intl)
                                }
                                label={intl.formatMessage(commonMessages.email)}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={change}
                            />
                        </DialogContent>
                        <hr className={classes.hr} />
                        <DialogActions>
                            <Button onClick={onClose}>
                                <FormattedMessage {...buttonMessages.back} />
                            </Button>
                            <ConfirmButton
                                data-test="submit"
                                color="primary"
                                disabled={!hasChanged}
                                variant="contained"
                                type="submit"
                                transitionState={confirmButtonState}
                            >
                                <FormattedMessage
                                    defaultMessage="Send invite"
                                    id="hw9Fah"
                                    description="button"
                                />
                            </ConfirmButton>
                        </DialogActions>
                    </>
                )}
            </Form>
        </Dialog>
    );
};

StaffAddMemberDialog.displayName = "StaffAddMemberDialog";

export default StaffAddMemberDialog;
