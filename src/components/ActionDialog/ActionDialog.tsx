/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { DialogProps } from "@mzawadie/core";
import React from "react";

import { ConfirmButtonTransitionState } from "../ConfirmButton";
import DialogButtons from "./DialogButtons";
import { ActionDialogVariant, Size } from "./types";

export interface ActionDialogProps extends DialogProps {
    children?: React.ReactNode;
    confirmButtonLabel?: string;
    confirmButtonState: ConfirmButtonTransitionState;
    disabled?: boolean;
    maxWidth?: Size | false;
    title: string;
    variant?: ActionDialogVariant;
    onConfirm: () => void;
}

const ActionDialog: React.FC<ActionDialogProps> = (props) => {
    const { children, open, title, onClose, variant, ...rest } = props;

    return (
        <Dialog fullWidth onClose={onClose} open={open} {...rest}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogButtons {...rest} onClose={onClose} variant={variant} />
        </Dialog>
    );
};

ActionDialog.defaultProps = {
    maxWidth: "xs",
};

ActionDialog.displayName = "ActionDialog";

export default ActionDialog;
