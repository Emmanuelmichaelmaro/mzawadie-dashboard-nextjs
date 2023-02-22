// @ts-nocheck
import { TextField, Typography } from "@material-ui/core";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { VerticalSpacer } from "@mzawadie/pages/apps/components/VerticalSpacer";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { getGiftCardErrorMessage } from "../messages";
import useGiftCardUpdateForm from "../providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import { giftCardExpirySelectMessages as messages } from "./messages";
import { useGiftCardExpirySelectStyles as useStyles } from "./styles";

const GiftCardUpdateExpirySelect: React.FC = () => {
    const intl = useIntl();
    const classes = useStyles({});

    const {
        change,
        data: { expiryDate },
        formErrors,
    } = useGiftCardUpdateForm();

    const [cardExpiresSelected, setCardExpiresSelected] = useStateFromProps(!!expiryDate);

    useEffect(() => {
        if (!cardExpiresSelected) {
            change({
                target: {
                    name: "expiryDate",
                    value: null,
                },
            });
        }
    }, [cardExpiresSelected]);

    return (
        <>
            <Typography>{intl.formatMessage(messages.expiryDateLabel)}</Typography>
            <VerticalSpacer />
            <ControlledCheckbox
                name="cardExpires"
                label={intl.formatMessage(messages.expiryDateCheckboxLabel)}
                checked={cardExpiresSelected}
                onChange={(event) => setCardExpiresSelected(event.target.value)}
            />

            {cardExpiresSelected && (
                <TextField
                    error={!!formErrors?.expiryDate}
                    helperText={getGiftCardErrorMessage(formErrors?.expiryDate, intl)}
                    onChange={change}
                    name="expiryDate"
                    fullWidth
                    className={classes.dateField}
                    label={intl.formatMessage(messages.expiryDateLabel)}
                    value={expiryDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    type="date"
                />
            )}
        </>
    );
};

export default GiftCardUpdateExpirySelect;
