// @ts-nocheck
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import ConfirmButton, { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Form from "@mzawadie/components/Form";
import Skeleton from "@mzawadie/components/Skeleton";
import { buttonMessages, maybe, DialogProps } from "@mzawadie/core";
import { ConfigurationTypeFieldEnum } from "@mzawadie/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PluginSecretFieldDialogFormData {
    value: string;
}
export interface PluginSecretFieldDialogProps extends DialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    field: PluginConfigurationFragment_configuration;
    onConfirm: (data: PluginSecretFieldDialogFormData) => void;
}

const PluginSecretFieldDialog: React.FC<PluginSecretFieldDialogProps> = ({
    confirmButtonState,
    field,
    onClose,
    onConfirm,
    open,
}) => {
    const intl = useIntl();

    const initialForm: PluginSecretFieldDialogFormData = {
        value: "",
    };

    return (
        <Dialog fullWidth onClose={onClose} open={open} maxWidth="sm">
            <DialogTitle>
                {field ? (
                    field.value === null ? (
                        intl.formatMessage({
                            defaultMessage: "Add Value to Authorization Field",
                            id: "qCH2eZ",
                            description: "header",
                        })
                    ) : (
                        intl.formatMessage({
                            defaultMessage: "Edit Authorization Field",
                            id: "Xy2T+y",
                            description: "header",
                        })
                    )
                ) : (
                    <Skeleton />
                )}
            </DialogTitle>
            <Form initial={initialForm} onSubmit={onConfirm}>
                {({ change, data, submit }) => (
                    <>
                        <DialogContent>
                            <TextField
                                multiline={field?.type === ConfigurationTypeFieldEnum.SECRETMULTILINE}
                                autoComplete="off"
                                fullWidth
                                label={field && field.label}
                                name="value"
                                type={
                                    maybe(() => field.type) === ConfigurationTypeFieldEnum.PASSWORD &&
                                    "password"
                                }
                                value={data.value || ""}
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
                            >
                                <FormattedMessage {...buttonMessages.confirm} />
                            </ConfirmButton>
                        </DialogActions>
                    </>
                )}
            </Form>
        </Dialog>
    );
};

PluginSecretFieldDialog.displayName = "PluginSecretFieldDialog";
export default PluginSecretFieldDialog;
