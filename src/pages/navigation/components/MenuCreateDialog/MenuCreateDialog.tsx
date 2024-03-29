// @ts-nocheck
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import BackButton from "@mzawadie/components/BackButton";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import { buttonMessages } from "@mzawadie/core";
import { MenuErrorFragment } from "@mzawadie/graphql";
import { getFormErrors } from "@mzawadie/utils/errors";
import getMenuErrorMessage from "@mzawadie/utils/errors/menu";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface MenuCreateDialogFormData {
    name: string;
}

export interface MenuCreateDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    disabled: boolean;
    errors: MenuErrorFragment[];
    open: boolean;
    onClose: () => void;
    onConfirm: (data: MenuCreateDialogFormData) => void;
}

const initialForm: MenuCreateDialogFormData = {
    name: "",
};

const MenuCreateDialog: React.FC<MenuCreateDialogProps> = ({
    confirmButtonState,
    disabled,
    errors,
    onClose,
    onConfirm,
    open,
}) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["name"], errors);

    return (
        <Dialog onClose={onClose} maxWidth="sm" fullWidth open={open}>
            <DialogTitle>
                <FormattedMessage
                    id="0OtaXa"
                    defaultMessage="Create Menu"
                    description="dialog header"
                />
            </DialogTitle>

            <Form initial={initialForm} onSubmit={onConfirm}>
                {({ change, data, submit }) => (
                    <>
                        <DialogContent>
                            <TextField
                                disabled={disabled}
                                error={!!formErrors.name}
                                fullWidth
                                helperText={getMenuErrorMessage(formErrors.name, intl)}
                                label={intl.formatMessage({
                                    id: "jhh/D6",
                                    defaultMessage: "Menu Title",
                                })}
                                name={"name" as keyof MenuCreateDialogFormData}
                                value={data.name}
                                onChange={change}
                            />
                        </DialogContent>

                        <DialogActions>
                            <BackButton onClick={onClose} />
                            <ConfirmButton
                                transitionState={confirmButtonState}
                                onClick={submit}
                                data-test-id="submit"
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

MenuCreateDialog.displayName = "MenuCreateDialog";

export default MenuCreateDialog;
