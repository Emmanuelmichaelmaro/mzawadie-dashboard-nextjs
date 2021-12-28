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
import { buttonMessages, maybe } from "@mzawadie/core";
import { AttributeErrorFragment } from "@mzawadie/fragments/types/AttributeErrorFragment";
import useModalDialogErrors from "@mzawadie/hooks/useModalDialogErrors";
import { getFormErrors } from "@mzawadie/utils/errors";
import { getAttributeValueErrorMessage } from "@mzawadie/views/attributes/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeValueEditDialogFormData {
    name: string | undefined;
}
export interface AttributeValueEditDialogProps {
    attributeValue: AttributeValueEditDialogFormData | null;
    confirmButtonState: ConfirmButtonTransitionState;
    disabled: boolean;
    errors: AttributeErrorFragment[];
    open: boolean;
    onSubmit: (data: AttributeValueEditDialogFormData) => void;
    onClose: () => void;
}

const AttributeValueEditDialog: React.FC<AttributeValueEditDialogProps> = ({
    attributeValue,
    confirmButtonState,
    disabled,
    errors: apiErrors,
    onClose,
    onSubmit,
    open,
}) => {
    const intl = useIntl();
    const initialForm: AttributeValueEditDialogFormData = {
        name: maybe(() => attributeValue?.name, ""),
    };
    const errors = useModalDialogErrors(apiErrors, open);
    const formErrors = getFormErrors(["name"], errors);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
            <DialogTitle>
                {attributeValue === null ? (
                    <FormattedMessage
                        defaultMessage="Add Value"
                        id="PqMbma"
                        description="add attribute value"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Edit Value"
                        id="XYhE8p"
                        description="edit attribute value"
                    />
                )}
            </DialogTitle>

            <Form initial={initialForm} onSubmit={onSubmit}>
                {({ change, data, submit }) => (
                    <>
                        <DialogContent>
                            <TextField
                                data-test-id="valueName"
                                autoFocus
                                disabled={disabled}
                                error={!!formErrors.name}
                                fullWidth
                                helperText={getAttributeValueErrorMessage(formErrors.name, intl)}
                                name={"name" as keyof AttributeValueEditDialogFormData}
                                label={intl.formatMessage({
                                    defaultMessage: "Name",
                                    id: "UhcALJ",
                                    description: "attribute name",
                                })}
                                value={data.name}
                                onChange={change}
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={onClose}>
                                <FormattedMessage {...buttonMessages.back} />
                            </Button>

                            <ConfirmButton
                                data-test="submit"
                                transitionState={confirmButtonState}
                                color="primary"
                                variant="contained"
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

AttributeValueEditDialog.displayName = "AttributeValueEditDialog";

export default AttributeValueEditDialog;
