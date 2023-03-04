import { DialogContentText, TextField } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { OrderErrorFragment } from "@mzawadie/fragments/types/OrderErrorFragment";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderMarkAsPaidDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: OrderErrorFragment[];
    open: boolean;
    transactionReference: string;
    onClose: () => void;
    onConfirm: () => void;
    handleTransactionReference: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrderMarkAsPaidDialog: React.FC<OrderMarkAsPaidDialogProps> = ({
    confirmButtonState,
    errors: apiErrors,
    handleTransactionReference,
    onClose,
    onConfirm,
    open,
    transactionReference,
}) => {
    const intl = useIntl();
    const errors = useModalDialogErrors(apiErrors, open);

    return (
        <ActionDialog
            confirmButtonState={confirmButtonState}
            open={open}
            title={intl.formatMessage({
                defaultMessage: "Mark Order as Paid",
                id: "+B25o/",
                description: "dialog header",
            })}
            onClose={onClose}
            onConfirm={onConfirm}
        >
            <DialogContentText>
                <FormattedMessage
                    defaultMessage="You're going to mark this order as paid."
                    id="sfEbeB"
                />
                <br />
                <FormattedMessage
                    defaultMessage="Please provide a transaction reference using the input below:"
                    id="rwOx2s"
                />
            </DialogContentText>

            <TextField
                fullWidth
                name="transactionReference"
                label={intl.formatMessage({
                    defaultMessage: "Transaction reference",
                    id: "EbVf0Z",
                    description: "transaction reference",
                })}
                value={transactionReference}
                onChange={handleTransactionReference}
            />

            {errors.length > 0 && (
                <>
                    <FormSpacer />
                    {errors.map((err, index) => (
                        <DialogContentText color="error" key={index}>
                            {getOrderErrorMessage(err, intl)}
                        </DialogContentText>
                    ))}
                </>
            )}
        </ActionDialog>
    );
};

OrderMarkAsPaidDialog.displayName = "OrderMarkAsPaidDialog";

export default OrderMarkAsPaidDialog;
