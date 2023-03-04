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
import { buttonMessages } from "@mzawadie/core";
import { OrderErrorFragment } from "@mzawadie/fragments/types/OrderErrorFragment";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderPaymentVoidDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: OrderErrorFragment[];
    open: boolean;
    onClose?();
    onConfirm?();
}

const OrderPaymentVoidDialog: React.FC<OrderPaymentVoidDialogProps> = ({
    confirmButtonState,
    errors,
    open,
    onConfirm,
    onClose,
}) => {
    const intl = useIntl();

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Void Payment"
                    id="KszPFx"
                    description="dialog header"
                />
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to void this payment?"
                        id="euRfu+"
                    />
                </DialogContentText>

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
            </DialogContent>

            <DialogActions>
                <BackButton onClick={onClose} />
                <ConfirmButton transitionState={confirmButtonState} onClick={onConfirm}>
                    <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
            </DialogActions>
        </Dialog>
    );
};

OrderPaymentVoidDialog.displayName = "OrderPaymentVoidDialog";

export default OrderPaymentVoidDialog;
