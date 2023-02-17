// @ts-nocheck
import { Card, CardContent, InputAdornment, TextField, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import {
    SingleAutocompleteSelectField,
    SingleAutocompleteChoiceType,
} from "@mzawadie/components/SingleAutocompleteSelectField";
import { commonMessages } from "@mzawadie/core";
import { ChannelErrorFragment } from "@mzawadie/fragments/types/ChannelErrorFragment";
import useClipboard from "@mzawadie/hooks/useClipboard";
import { ChangeEvent, FormChange } from "@mzawadie/hooks/useForm";
import { CountryCode } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import getChannelsErrorMessage from "@mzawadie/utils/errors/channels";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../styles";
import { ExtendedFormHelperTextProps } from "./types";

export interface FormData {
    name: string;
    currencyCode: string;
    slug: string;
    shippingZonesIdsToAdd: string[];
    shippingZonesIdsToRemove: string[];
    defaultCountry: CountryCode;
}

export interface ChannelFormProps {
    data: FormData;
    disabled: boolean;
    currencyCodes?: SingleAutocompleteChoiceType[];
    errors: ChannelErrorFragment[];
    selectedCurrencyCode?: string;
    selectedCountryDisplayName: string;
    countries: SingleAutocompleteChoiceType[];
    onChange: FormChange;
    onCurrencyCodeChange?: (event: ChangeEvent) => void;
    onDefaultCountryChange: (event: ChangeEvent) => void;
}

const ChannelForm: React.FC<ChannelFormProps> = ({
    currencyCodes,
    data,
    disabled,
    errors,
    selectedCurrencyCode,
    selectedCountryDisplayName,
    countries,
    onChange,
    onCurrencyCodeChange,
    onDefaultCountryChange,
}) => {
    const intl = useIntl();
    const [copied, copy] = useClipboard();

    const formErrors = getFormErrors<keyof FormData, ChannelErrorFragment>(
        ["name", "slug", "currencyCode"],
        errors
    );

    const classes = useStyles({});

    return (
        <>
            <Card>
                <CardTitle title={intl.formatMessage(commonMessages.generalInformations)} />

                <CardContent>
                    <TextField
                        error={!!formErrors.name}
                        helperText={getChannelsErrorMessage(formErrors?.name, intl)}
                        disabled={disabled}
                        fullWidth
                        label={intl.formatMessage({
                            defaultMessage: "Channel name",
                            id: "UymotP",
                            description: "channel name",
                        })}
                        name="name"
                        value={data.name}
                        onChange={onChange}
                    />

                    <FormSpacer />

                    <TextField
                        error={!!formErrors.slug}
                        helperText={getChannelsErrorMessage(formErrors?.slug, intl)}
                        disabled={disabled}
                        fullWidth
                        FormHelperTextProps={
                            {
                                "data-test-id": "slug-text-input-helper-text",
                            } as ExtendedFormHelperTextProps
                        }
                        label={intl.formatMessage({
                            defaultMessage: "Slug",
                            id: "74Zo/H",
                            description: "channel slug",
                        })}
                        name="slug"
                        value={data.slug}
                        onChange={onChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment
                                    className={classes.copyBtn}
                                    position="end"
                                    disableTypography
                                    onClick={() => copy(data.slug)}
                                >
                                    {copied ? (
                                        <FormattedMessage
                                            defaultMessage="Copied"
                                            id="r86alc"
                                            description="button"
                                        />
                                    ) : (
                                        <FormattedMessage
                                            defaultMessage="Copy"
                                            id="ZhaXLU"
                                            description="button"
                                        />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormSpacer />
                </CardContent>
            </Card>

            <CardSpacer />

            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Channel Settings",
                        id: "3y4r+z",
                        description: "channel settings",
                    })}
                />

                <CardContent>
                    {currencyCodes ? (
                        <SingleAutocompleteSelectField
                            data-test-id="channel-currency-select-input"
                            allowCustomValues
                            error={!!formErrors.currencyCode}
                            FormHelperTextProps={
                                {
                                    "data-test-id": "currency-text-input-helper-text",
                                } as ExtendedFormHelperTextProps
                            }
                            helperText={getChannelsErrorMessage(formErrors?.currencyCode, intl)}
                            disabled={disabled}
                            label={intl.formatMessage({
                                defaultMessage: "Currency",
                                id: "9Sz0By",
                                description: "channel currency",
                            })}
                            choices={currencyCodes}
                            name="currencyCode"
                            displayValue={selectedCurrencyCode}
                            value={selectedCurrencyCode}
                            onChange={onCurrencyCodeChange}
                        />
                    ) : (
                        <>
                            <Typography variant="caption" className={classes.label}>
                                <FormattedMessage
                                    defaultMessage="Selected currency"
                                    id="39yi8w"
                                    description="selected currency"
                                />
                            </Typography>

                            <Typography>{data.currencyCode}</Typography>
                        </>
                    )}

                    <FormSpacer />

                    <SingleAutocompleteSelectField
                        data-test-id="country-select-input"
                        error={!!formErrors.defaultCountry}
                        FormHelperTextProps={
                            {
                                "data-test-id": "country-text-input-helper-text",
                            } as ExtendedFormHelperTextProps
                        }
                        helperText={getChannelsErrorMessage(formErrors?.defaultCountry, intl)}
                        disabled={disabled}
                        label={intl.formatMessage({
                            defaultMessage: "Default country",
                            id: "tV+Dcm",
                        })}
                        choices={countries}
                        name="defaultCountry"
                        displayValue={selectedCountryDisplayName}
                        value={data.defaultCountry}
                        onChange={onDefaultCountryChange}
                    />
                </CardContent>
            </Card>
        </>
    );
};

ChannelForm.displayName = "ChannelForm";

export default ChannelForm;
