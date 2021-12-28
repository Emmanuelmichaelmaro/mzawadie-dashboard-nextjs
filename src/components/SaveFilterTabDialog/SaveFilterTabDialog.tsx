/* eslint-disable react/prop-types */
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@material-ui/core";
import { buttonMessages } from "@mzawadie/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, { ConfirmButtonTransitionState } from "../ConfirmButton";
import Form from "../Form";

export interface SaveFilterTabDialogFormData {
    name: string;
}

const initialForm: SaveFilterTabDialogFormData = {
    name: "",
};

export interface SaveFilterTabDialogProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SaveFilterTabDialogFormData) => void;
}

const SaveFilterTabDialog: React.FC<SaveFilterTabDialogProps> = ({
    confirmButtonState,
    onClose,
    onSubmit,
    open,
}) => {
    const intl = useIntl();
    const [errors, setErrors] = React.useState(false);
    const handleErrors = (data: SaveFilterTabDialogFormData) => {
        if (data.name.length) {
            onSubmit(data);
            setErrors(false);
        } else {
            setErrors(true);
        }
    };

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Save Custom Search"
                    id="liLrVs"
                    description="save filter tab, header"
                />
            </DialogTitle>

            <Form initial={initialForm} onSubmit={handleErrors}>
                {({ change, data, submit }: any) => (
                    <>
                        <DialogContent>
                            <TextField
                                autoFocus
                                fullWidth
                                label={intl.formatMessage({
                                    defaultMessage: "Search Name",
                                    id: "QcIFCs",
                                    description: "save search tab",
                                })}
                                name={"name" as keyof SaveFilterTabDialogFormData}
                                value={data.name}
                                onChange={change}
                                error={errors}
                                helperText={errors ? "This field is required" : null}
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={onClose}>
                                <FormattedMessage {...buttonMessages.back} />
                            </Button>
                            <ConfirmButton
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

SaveFilterTabDialog.displayName = "SaveFilterTabDialog";

export default SaveFilterTabDialog;
