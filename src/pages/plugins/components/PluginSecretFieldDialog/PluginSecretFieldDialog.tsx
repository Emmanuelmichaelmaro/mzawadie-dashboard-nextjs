// @ts-nocheck
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import BackButton from "@mzawadie/components/BackButton";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import Skeleton from "@mzawadie/components/Skeleton";
import { buttonMessages, maybe, DialogProps } from "@mzawadie/core";
import { PluginConfigurationExtendedFragment_configuration } from "@mzawadie/fragments/types/PluginConfigurationExtendedFragment";
import { ConfigurationTypeFieldEnum } from "@mzawadie/types/globalTypes";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface PluginSecretFieldDialogFormData {
    value: string;
}

export interface PluginSecretFieldDialogProps extends DialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    field: PluginConfigurationExtendedFragment_configuration;
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
                            <BackButton onClick={onClose} />
                            <ConfirmButton transitionState={confirmButtonState} onClick={submit}>
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
