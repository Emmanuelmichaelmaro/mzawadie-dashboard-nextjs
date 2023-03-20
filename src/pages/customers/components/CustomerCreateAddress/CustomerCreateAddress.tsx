// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import { AddressEdit } from "@mzawadie/components/AddressEdit";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { FormSpacer } from "@mzawadie/components/FormSpacer";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { AccountErrorFragment } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AddressTypeInput } from "../../types";

const useStyles = makeStyles(
    {
        overflow: {
            overflow: "visible",
        },
    },
    { name: "CustomerCreateAddress" }
);

export interface CustomerCreateAddressProps {
    countries: SingleAutocompleteChoiceType[];
    countryDisplayName: string;
    data: AddressTypeInput;
    disabled: boolean;
    errors: AccountErrorFragment[];
    onChange(event: React.ChangeEvent<any>);
    onCountryChange(event: React.ChangeEvent<any>);
}

const CustomerCreateAddress: React.FC<CustomerCreateAddressProps> = (props) => {
    const { countries, countryDisplayName, data, disabled, errors, onChange, onCountryChange } = props;

    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card className={classes.overflow}>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Primary Address",
                    id: "jGGnSZ",
                    description: "page header",
                })}
            />

            <CardContent className={classes.overflow}>
                <Typography>
                    <FormattedMessage
                        defaultMessage="The primary address of this customer."
                        id="wNQzS/"
                    />
                </Typography>

                <FormSpacer />

                <AddressEdit
                    countries={countries}
                    data={data}
                    disabled={disabled}
                    countryDisplayValue={countryDisplayName}
                    errors={errors}
                    onChange={onChange}
                    onCountryChange={onCountryChange}
                />
            </CardContent>
        </Card>
    );
};

CustomerCreateAddress.displayName = "CustomerCreateAddress";

export default CustomerCreateAddress;
