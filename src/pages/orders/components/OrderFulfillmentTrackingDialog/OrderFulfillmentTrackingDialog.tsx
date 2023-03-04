import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import BackButton from "@mzawadie/components/BackButton";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { buttonMessages } from "@mzawadie/core";
import { OrderErrorFragment } from "@mzawadie/fragments/types/OrderErrorFragment";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import { getFormErrors } from "@mzawadie/utils/errors";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
    trackingNumber: string;
}

export interface OrderFulfillmentTrackingDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: OrderErrorFragment[];
    open: boolean;
    trackingNumber: string;
    onClose();
    onConfirm(data: FormData);
}

const OrderFulfillmentTrackingDialog: React.FC<OrderFulfillmentTrackingDialogProps> = ({
    confirmButtonState,
    errors: apiErrors,
    open,
    trackingNumber,
    onConfirm,
    onClose,
}) => {
    const intl = useIntl();
    const errors = useModalDialogErrors(apiErrors, open);

    const formFields = ["trackingNumber"];
    const formErrors = getFormErrors(formFields, errors);

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <Form confirmLeave initial={{ trackingNumber }} onSubmit={onConfirm}>
                {({ change, data, submit }) => (
                    <>
                        <DialogTitle>
                            <FormattedMessage
                                defaultMessage="Add Tracking Code"
                                id="/BJQIq"
                                description="dialog header"
                            />
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                error={!!formErrors.trackingNumber}
                                helperText={getOrderErrorMessage(formErrors.trackingNumber, intl)}
                                label={intl.formatMessage({
                                    defaultMessage: "Tracking number",
                                    id: "yT/GAp",
                                })}
                                name="trackingNumber"
                                onChange={change}
                                value={data.trackingNumber}
                                fullWidth
                            />
                            {errors.length > 0 && (
                                <>
                                    <FormSpacer />
                                    {errors
                                        .filter((err) => !formFields.includes(err.field))
                                        .map((err, index) => (
                                            <DialogContentText color="error" key={index}>
                                                {getOrderErrorMessage(err, intl)}
                                            </DialogContentText>
                                        ))}
                                </>
                            )}
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
OrderFulfillmentTrackingDialog.displayName = "OrderFulfillmentTrackingDialog";
export default OrderFulfillmentTrackingDialog;
