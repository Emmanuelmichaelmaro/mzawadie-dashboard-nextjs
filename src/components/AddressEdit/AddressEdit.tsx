import { TextField } from "@material-ui/core";
import { commonMessages } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import { OrderErrorFragment } from "@mzawadie/fragments/types/OrderErrorFragment";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAccountErrorMessage from "@mzawadie/utils/errors/account";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import { AddressTypeInput } from "@mzawadie/views/customers/types";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

// eslint-disable-next-line import/no-named-as-default
import FormSpacer from "../FormSpacer";
import SingleAutocompleteSelectField, {
    SingleAutocompleteChoiceType,
} from "../SingleAutocompleteSelectField";

const useStyles = makeStyles(
    (theme) => ({
        root: {
            display: "grid",
            gridColumnGap: theme.spacing(2),
            gridTemplateColumns: "1fr 1fr",
        },
    }),
    { name: "AddressEdit" }
);

interface AddressEditProps {
    countries: SingleAutocompleteChoiceType[];
    countryDisplayValue: string;
    data: AddressTypeInput;
    disabled?: boolean;
    errors: Array<AccountErrorFragment | OrderErrorFragment>;
    onChange: (event: React.ChangeEvent<any>) => any;
    onCountryChange: (event: React.ChangeEvent<any>) => any;
}

function getErrorMessage(
    err: AccountErrorFragment | OrderErrorFragment,
    intl: IntlShape
): string | undefined {
    if (err?.__typename === "AccountError") {
        return getAccountErrorMessage(err, intl);
    }

    return getOrderErrorMessage(err, intl);
}

const AddressEdit: React.FC<AddressEditProps> = (props) => {
    const { countries, countryDisplayValue, data, disabled, errors, onChange, onCountryChange } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const formFields: Array<keyof AddressTypeInput> = [
        "city",
        "cityArea",
        "country",
        "countryArea",
        "firstName",
        "lastName",
        "companyName",
        "phone",
        "postalCode",
        "streetAddress1",
        "streetAddress2",
    ];

    const formErrors = getFormErrors<keyof AddressTypeInput, AccountErrorFragment | OrderErrorFragment>(
        formFields,
        errors
    );

    return (
        <>
            <div className={classes.root}>
                <div>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.firstName}
                        helperText={getErrorMessage(formErrors.firstName, intl)}
                        label={intl.formatMessage(commonMessages.firstName)}
                        name="firstName"
                        onChange={onChange}
                        value={data.firstName}
                        fullWidth
                        InputProps={{
                            autoComplete: "given-name",
                        }}
                    />
                </div>
                <div>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.lastName}
                        helperText={getErrorMessage(formErrors.lastName, intl)}
                        label={intl.formatMessage(commonMessages.lastName)}
                        name="lastName"
                        onChange={onChange}
                        value={data.lastName}
                        fullWidth
                        InputProps={{
                            autoComplete: "family-name",
                        }}
                    />
                </div>
            </div>
            <FormSpacer />
            <div className={classes.root}>
                <div>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.companyName}
                        helperText={getErrorMessage(formErrors.companyName, intl)}
                        label={intl.formatMessage({
                            defaultMessage: "Company",
                            id: "9YazHG",
                        })}
                        name="companyName"
                        onChange={onChange}
                        value={data.companyName}
                        fullWidth
                        InputProps={{
                            autoComplete: "organization",
                        }}
                    />
                </div>
                <div>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.phone}
                        fullWidth
                        helperText={getErrorMessage(formErrors.phone, intl)}
                        label={intl.formatMessage({
                            defaultMessage: "Phone",
                            id: "O95R3Z",
                        })}
                        name="phone"
                        value={data.phone}
                        onChange={onChange}
                        InputProps={{
                            autoComplete: "tel",
                        }}
                    />
                </div>
            </div>
            <FormSpacer />
            <TextField
                disabled={disabled}
                error={!!formErrors.streetAddress1}
                helperText={getErrorMessage(formErrors.streetAddress1, intl)}
                label={intl.formatMessage({
                    defaultMessage: "Address line 1",
                    id: "B52Em/",
                })}
                name="streetAddress1"
                onChange={onChange}
                value={data.streetAddress1}
                fullWidth
                InputProps={{
                    autoComplete: "address-line1",
                }}
            />
            <FormSpacer />
            <TextField
                disabled={disabled}
                error={!!formErrors.streetAddress2}
                helperText={getErrorMessage(formErrors.streetAddress2, intl)}
                label={intl.formatMessage({
                    defaultMessage: "Address line 2",
                    id: "oQY0a2",
                })}
                name="streetAddress2"
                onChange={onChange}
                value={data.streetAddress2}
                fullWidth
                InputProps={{
                    autoComplete: "address-line2",
                }}
            />
            <FormSpacer />
            <div className={classes.root}>
                <div>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.city}
                        helperText={getErrorMessage(formErrors.city, intl)}
                        label={intl.formatMessage({
                            defaultMessage: "City",
                            id: "TE4fIS",
                        })}
                        name="city"
                        onChange={onChange}
                        value={data.city}
                        fullWidth
                        InputProps={{
                            autoComplete: "address-level2",
                        }}
                    />
                </div>
                <div>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.postalCode}
                        helperText={getErrorMessage(formErrors.postalCode, intl)}
                        label={intl.formatMessage({
                            defaultMessage: "ZIP / Postal code",
                            id: "oYGfnY",
                        })}
                        name="postalCode"
                        onChange={onChange}
                        value={data.postalCode}
                        fullWidth
                        InputProps={{
                            autoComplete: "postal-code",
                        }}
                    />
                </div>
            </div>

            <FormSpacer />
            <div className={classes.root}>
                <div>
                    <SingleAutocompleteSelectField
                        disabled={disabled}
                        data-test-id="address-edit-country-select-field"
                        displayValue={countryDisplayValue}
                        error={!!formErrors.country}
                        helperText={getErrorMessage(formErrors.country, intl)}
                        label={intl.formatMessage({
                            defaultMessage: "Country",
                            id: "vONi+O",
                        })}
                        name="country"
                        onChange={onCountryChange}
                        value={data.country}
                        choices={countries}
                        InputProps={{
                            inputProps: {
                                autoComplete: "none",
                            },
                        }}
                    />
                </div>
                <div>
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.countryArea}
                        helperText={getErrorMessage(formErrors.countryArea, intl)}
                        label={intl.formatMessage({
                            defaultMessage: "Country area",
                            id: "AuwpCm",
                        })}
                        name="countryArea"
                        onChange={onChange}
                        value={data.countryArea}
                        fullWidth
                        InputProps={{
                            autoComplete: "address-level1",
                        }}
                    />
                </div>
            </div>
        </>
    );
};
AddressEdit.displayName = "AddressEdit";
export default AddressEdit;
