/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { getErrorMessage } from "@mzawadie/components/Attributes/utils";
import { commonMessages, DateTime, joinDateTime, splitDateTime } from "@mzawadie/core";
import { PageErrorWithAttributesFragment } from "@mzawadie/fragments/types/PageErrorWithAttributesFragment";
import { ProductErrorWithAttributesFragment } from "@mzawadie/fragments/types/ProductErrorWithAttributesFragment";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

type DateTimeFieldProps = Omit<TextFieldProps, "label" | "error"> & {
    onChange: (value: string) => void;
    error: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment;
    value: string;
};

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
    disabled,
    error,
    name,
    onChange,
    value: initialValue,
}) => {
    const intl = useIntl();
    const [value, setValue] = useState<DateTime>(
        initialValue ? splitDateTime(initialValue) : { date: "", time: "" }
    );

    useEffect(() => onChange(joinDateTime(value.date, value.time)), [value]);

    return (
        <>
            <TextField
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={getErrorMessage(error, intl)}
                label={intl.formatMessage(commonMessages.date)}
                name={`${name}:date`}
                onChange={(event) => {
                    const date = event.target.value;
                    setValue((value) => ({ ...value, date }));
                }}
                type="date"
                value={value.date}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={getErrorMessage(error, intl)}
                label={intl.formatMessage(commonMessages.time)}
                name={`${name}:time`}
                onChange={(event) => {
                    const time = event.target.value;
                    setValue((value) => ({ ...value, time }));
                }}
                type="time"
                value={value.time}
                InputLabelProps={{ shrink: true }}
            />
        </>
    );
};
