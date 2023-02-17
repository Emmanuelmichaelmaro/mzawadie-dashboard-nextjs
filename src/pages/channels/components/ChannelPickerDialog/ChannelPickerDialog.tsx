// @ts-nocheck
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { Choices, SingleSelectField } from "@mzawadie/components/SingleSelectField";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "../styles";

export interface ChannelPickerDialogProps {
    channelsChoices: Choices;
    confirmButtonState: ConfirmButtonTransitionState;
    defaultChoice: string;
    open: boolean;
    onClose: () => void;
    onConfirm: (choice: string) => void;
}

const ChannelPickerDialog: React.FC<ChannelPickerDialogProps> = ({
    channelsChoices = [],
    confirmButtonState,
    defaultChoice,
    open,
    onClose,
    onConfirm,
}) => {
    const classes = useStyles({});
    const intl = useIntl();
    const [choice, setChoice] = useStateFromProps(
        defaultChoice || (channelsChoices.length ? channelsChoices[0].value : "")
    );

    return (
        <ActionDialog
            confirmButtonState={confirmButtonState}
            open={open}
            onClose={onClose}
            onConfirm={() => onConfirm(choice)}
            title={intl.formatMessage({
                defaultMessage: "Select a channel",
                id: "G/pgG3",
                description: "dialog header",
            })}
        >
            <div>
                <div className={classes.select}>
                    <SingleSelectField
                        choices={channelsChoices}
                        name="channels"
                        label={intl.formatMessage({
                            defaultMessage: "Channel name",
                            id: "nKwgxY",
                            description: "select label",
                        })}
                        value={choice}
                        onChange={(e) => setChoice(e.target.value)}
                    />
                </div>
            </div>
        </ActionDialog>
    );
};

ChannelPickerDialog.displayName = "ChannelPickerDialog";

export default ChannelPickerDialog;
