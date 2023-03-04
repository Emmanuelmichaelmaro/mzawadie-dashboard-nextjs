// @ts-nocheck
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import BackButton from "@mzawadie/components/BackButton";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { SingleAutocompleteSelectField } from "@mzawadie/components/SingleAutocompleteSelectField";
import { buttonMessages } from "@mzawadie/core";
import { OrderErrorFragment } from "@mzawadie/fragments/types/OrderErrorFragment";
import { WarehouseFragment } from "@mzawadie/fragments/types/WarehouseFragment";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderFulfillmentCancelDialogFormData {
    warehouseId: string;
}

const useStyles = makeStyles(
    (theme) => ({
        enableOverflow: {
            overflow: "visible",
        },
        paragraph: {
            marginBottom: theme.spacing(2),
        },
        selectCcontainer: {
            width: "60%",
        },
    }),
    { name: "OrderFulfillmentCancelDialog" }
);

export interface OrderFulfillmentCancelDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    errors: OrderErrorFragment[];
    open: boolean;
    warehouses: WarehouseFragment[];
    onClose();
    onConfirm(data: OrderFulfillmentCancelDialogFormData);
}

const OrderFulfillmentCancelDialog: React.FC<OrderFulfillmentCancelDialogProps> = (props) => {
    const { confirmButtonState, errors, open, warehouses, onConfirm, onClose } = props;

    const classes = useStyles(props);
    const intl = useIntl();
    const [displayValue, setDisplayValue] = React.useState("");

    const choices = warehouses?.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.id,
    }));

    return (
        <Dialog
            classes={{
                paper: classes.enableOverflow,
            }}
            onClose={onClose}
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <Form confirmLeave initial={{ warehouseId: null }} onSubmit={onConfirm}>
                {({ change, data: formData, submit }) => {
                    const handleChange = createSingleAutocompleteSelectHandler(
                        change,
                        setDisplayValue,
                        choices
                    );
                    return (
                        <>
                            <DialogTitle>
                                <FormattedMessage
                                    defaultMessage="Cancel Fulfillment"
                                    id="bb4nSp"
                                    description="dialog header"
                                />
                            </DialogTitle>
                            <DialogContent className={classes.enableOverflow}>
                                <DialogContentText className={classes.paragraph}>
                                    <FormattedMessage
                                        defaultMessage="Are you sure you want to cancel fulfillment? Canceling a fulfillment will restock products at a selected warehouse."
                                        id="xco5tZ"
                                    />
                                </DialogContentText>
                                <div
                                    className={classes.selectCcontainer}
                                    data-test-id="cancel-fulfillment-select-field"
                                >
                                    <SingleAutocompleteSelectField
                                        choices={choices}
                                        displayValue={displayValue}
                                        label={intl.formatMessage({
                                            defaultMessage: "Select Warehouse",
                                            id: "aHc89n",
                                            description: "select warehouse to restock items",
                                        })}
                                        name="warehouseId"
                                        value={formData.warehouseId}
                                        onChange={handleChange}
                                    />
                                </div>
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
                                <ConfirmButton
                                    data-test-id="submit"
                                    disabled={formData.warehouseId === null}
                                    transitionState={confirmButtonState}
                                    onClick={submit}
                                >
                                    <FormattedMessage {...buttonMessages.accept} />
                                </ConfirmButton>
                            </DialogActions>
                        </>
                    );
                }}
            </Form>
        </Dialog>
    );
};
OrderFulfillmentCancelDialog.displayName = "OrderFulfillmentCancelDialog";
export default OrderFulfillmentCancelDialog;
