import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { OrderErrorFragment } from "@mzawadie/fragments/types/OrderErrorFragment";
import { useModalDialogErrors } from "@mzawadie/hooks/useModalDialogErrors";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderDraftCancelDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: OrderErrorFragment[];
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderNumber: string;
}

const OrderDraftCancelDialog: React.FC<OrderDraftCancelDialogProps> = ({
    confirmButtonState,
    errors: apiErrors,
    onClose,
    onConfirm,
    open,
    orderNumber,
}) => {
    const intl = useIntl();
    const errors = useModalDialogErrors(apiErrors, open);

    return (
        <ActionDialog
            confirmButtonState={confirmButtonState}
            onClose={onClose}
            onConfirm={onConfirm}
            open={open}
            title={intl.formatMessage({
                defaultMessage: "Delete Daft Order",
                id: "APcoSA",
                description: "dialog header",
            })}
            variant="delete"
        >
            <DialogContentText key="cancel">
                <FormattedMessage
                    defaultMessage="Are you sure you want to delete draft #{orderNumber}?"
                    id="mxtAFx"
                    values={{
                        orderNumber: <strong>{orderNumber}</strong>,
                    }}
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
        </ActionDialog>
    );
};
OrderDraftCancelDialog.displayName = "OrderDraftCancelDialog";
export default OrderDraftCancelDialog;
