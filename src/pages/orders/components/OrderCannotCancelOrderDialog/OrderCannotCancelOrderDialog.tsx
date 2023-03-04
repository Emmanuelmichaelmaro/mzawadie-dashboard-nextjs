import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import { buttonMessages, DialogProps } from "@mzawadie/core";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        button: {
            backgroundColor: theme.palette.error.main,
        },
    }),
    {
        name: "OrderCannotCancelOrderDialog",
    }
);

const OrderCannotCancelOrderDialog: React.FC<DialogProps> = ({ open, onClose }) => {
    const classes = useStyles({});

    return (
        <Dialog onClose={onClose} open={open} maxWidth="sm">
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Mzawadie could’t cancel order"
                    id="oUcxtP"
                    description="dialog header"
                />
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="There are still fulfillment's created for this order. Cancel the fulfillment's first before you cancel the order."
                        id="e6I39q"
                    />
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button variant="primary" className={classes.button} onClick={onClose}>
                    <FormattedMessage {...buttonMessages.ok} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

OrderCannotCancelOrderDialog.displayName = "OrderCannotCancelOrderDialog";

export default OrderCannotCancelOrderDialog;
