import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import BackButton from "@mzawadie/components/BackButton";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { buttonMessages, DialogProps } from "@mzawadie/core";
import { InvoiceErrorFragment, InvoiceFragment } from "@mzawadie/graphql";
import getInvoiceErrorMessage from "@mzawadie/utils/errors/invoice";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderInvoiceEmailSendDialogProps extends DialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: InvoiceErrorFragment[];
    invoice: InvoiceFragment;
    onSend: () => void;
}

const OrderInvoiceEmailSendDialog: React.FC<OrderInvoiceEmailSendDialogProps> = ({
    confirmButtonState,
    errors,
    open,
    invoice,
    onClose,
    onSend,
}) => {
    const intl = useIntl();

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
            <DialogTitle>
                {intl.formatMessage({
                    defaultMessage: "Send Invoice",
                    id: "5JT4v2",
                    description: "dialog header",
                })}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to send this invoice: {invoiceNumber} to the customer?"
                        id="MPfyne"
                        values={{
                            invoiceNumber: <strong>{invoice?.number}</strong>,
                        }}
                    />
                </DialogContentText>

                {errors.length > 0 && (
                    <>
                        <FormSpacer />
                        {errors.map((err, idx) => (
                            <DialogContentText key={idx} color="error">
                                {getInvoiceErrorMessage(err, intl)}
                            </DialogContentText>
                        ))}
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <BackButton onClick={onClose} />
                <ConfirmButton transitionState={confirmButtonState} onClick={onSend}>
                    <FormattedMessage {...buttonMessages.send} />
                </ConfirmButton>
            </DialogActions>
        </Dialog>
    );
};

OrderInvoiceEmailSendDialog.displayName = "OrderInvoiceEmailSendDialog";

export default OrderInvoiceEmailSendDialog;
