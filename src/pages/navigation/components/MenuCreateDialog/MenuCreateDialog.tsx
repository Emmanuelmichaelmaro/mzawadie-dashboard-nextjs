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
import { buttonMessages } from "@mzawadie/core";
import { MenuErrorFragment } from "@mzawadie/fragments/types/MenuErrorFragment";
import { getFormErrors } from "@mzawadie/utils/errors";
import getMenuErrorMessage from "@mzawadie/utils/errors/menu";
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
                    defaultMessage="Create Menu"
                    description="dialog header"
                    id="0OtaXa"
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
                                    defaultMessage: "Menu Title",
                                    id: "jhh/D6",
                                })}
                                name={"name" as keyof MenuCreateDialogFormData}
                                value={data.name}
                                onChange={change}
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={onClose}>
                                <FormattedMessage {...buttonMessages.back} />
                            </Button>

                            <ConfirmButton
                                transitionState={confirmButtonState}
                                color="primary"
                                variant="contained"
                                onClick={submit}
                                data-test="submit"
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
