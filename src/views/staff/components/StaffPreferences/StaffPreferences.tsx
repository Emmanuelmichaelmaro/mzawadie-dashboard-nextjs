// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { Locale, localeData } from "@mzawadie/components/Locale";
import SingleAutocompleteSelectField from "@mzawadie/components/SingleAutocompleteSelectField";
import { capitalize } from "@mzawadie/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPreferencesProps {
    locale: Locale;
    onLocaleChange: (locale: Locale) => void;
}

const StaffPreferences: React.FC<StaffPreferencesProps> = ({ locale, onLocaleChange }) => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Preferences",
                    id: "CLeDae",
                    description: "section header",
                })}
            />

            <CardContent>
                <SingleAutocompleteSelectField
                    choices={Object.values(Locale).map((locale) => ({
                        label: capitalize(localeData[locale]),
                        value: locale,
                    }))}
                    displayValue={localeData[locale]}
                    helperText={intl.formatMessage({
                        defaultMessage: "Selecting this will change the language of your dashboard",
                        id: "JJgJwi",
                    })}
                    label={intl.formatMessage({
                        defaultMessage: "Preferred Language",
                        id: "mr9jbO",
                    })}
                    name="locale"
                    value={locale}
                    onChange={(event) => onLocaleChange(event.target.value)}
                />

                <FormSpacer />

                <Typography>
                    <FormattedMessage
                        defaultMessage="Please note, while all currency and date adjustments are complete, language translations are at varying degrees of completion."
                        id="e822us"
                    />
                </Typography>
            </CardContent>
        </Card>
    );
};

StaffPreferences.displayName = "StaffPreferences";

export default StaffPreferences;
