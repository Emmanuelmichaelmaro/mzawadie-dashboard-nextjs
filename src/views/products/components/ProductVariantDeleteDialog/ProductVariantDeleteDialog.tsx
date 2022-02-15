import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import ConfirmButton, { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { buttonMessages } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        deleteButton: {
            "&:hover": {
                backgroundColor: theme.palette.error.main,
            },
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
    }),
    { name: "ProductVariantDeleteDialog" }
);

export interface ProductVariantDeleteDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    name: string;
    onClose?: () => void;
    onConfirm?: () => void;
}

const ProductVariantDeleteDialog: React.FC<ProductVariantDeleteDialogProps> = (props) => {
    const { confirmButtonState, name, open, onConfirm, onClose } = props;

    const classes = useStyles(props);

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Delete Variant"
                    id="GFJabu"
                    description="dialog header"
                />
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {name}?"
                        id="WwNtFn"
                        description="delete product variant"
                        values={{
                            name,
                        }}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                    transitionState={confirmButtonState}
                    className={classes.deleteButton}
                    variant="contained"
                    onClick={onConfirm}
                >
                    <FormattedMessage
                        defaultMessage="Delete variant"
                        id="rbkmfG"
                        description="button"
                    />
                </ConfirmButton>
            </DialogActions>
        </Dialog>
    );
};
ProductVariantDeleteDialog.displayName = "ProductVariantDeleteDialog";
export default ProductVariantDeleteDialog;
