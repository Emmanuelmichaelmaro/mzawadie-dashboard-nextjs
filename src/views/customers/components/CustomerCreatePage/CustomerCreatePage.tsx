// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { CardSpacer } from "@mzawadie/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import useAddressValidation from "@mzawadie/hooks/useAddressValidation";
import { AddressInput } from "@mzawadie/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@mzawadie/utils/maps";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AddressTypeInput } from "../../types";
import { CustomerCreateData_shop_countries } from "../../types/CustomerCreateData";
import CustomerCreateAddress from "../CustomerCreateAddress/CustomerCreateAddress";
import CustomerCreateDetails from "../CustomerCreateDetails";
import CustomerCreateNote from "../CustomerCreateNote/CustomerCreateNote";

export interface CustomerCreatePageFormData {
    customerFirstName: string;
    customerLastName: string;
    email: string;
    note: string;
}
export interface CustomerCreatePageSubmitData extends CustomerCreatePageFormData {
    address: AddressInput;
}

const initialForm: CustomerCreatePageFormData & AddressTypeInput = {
    city: "",
    cityArea: "",
    companyName: "",
    country: "",
    countryArea: "",
    customerFirstName: "",
    customerLastName: "",
    email: "",
    firstName: "",
    lastName: "",
    note: "",
    phone: "",
    postalCode: "",
    streetAddress1: "",
    streetAddress2: "",
};

export interface CustomerCreatePageProps {
    countries: CustomerCreateData_shop_countries[];
    disabled: boolean;
    errors: AccountErrorFragment[];
    saveButtonBar: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: CustomerCreatePageSubmitData) => void;
}

const CustomerCreatePage: React.FC<CustomerCreatePageProps> = ({
    countries,
    disabled,
    errors: apiErrors,
    saveButtonBar,
    onBack,
    onSubmit,
}: CustomerCreatePageProps) => {
    const intl = useIntl();

    const [countryDisplayName, setCountryDisplayName] = React.useState("");
    const countryChoices = mapCountriesToChoices(countries);
    const { errors: validationErrors, submit: handleSubmitWithAddress } = useAddressValidation<
        CustomerCreatePageFormData,
        void
    >((formData) =>
        onSubmit({
            address: {
                city: formData.city,
                cityArea: formData.cityArea,
                companyName: formData.companyName,
                country: formData.country,
                countryArea: formData.countryArea,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                postalCode: formData.postalCode,
                streetAddress1: formData.streetAddress1,
                streetAddress2: formData.streetAddress2,
            },
            customerFirstName: formData.customerFirstName,
            customerLastName: formData.customerLastName,
            email: formData.email,
            note: formData.note,
        })
    );

    const errors = [...apiErrors, ...validationErrors];

    const handleSubmit = (formData: CustomerCreatePageFormData & AddressTypeInput) => {
        const areAddressInputFieldsModified = (
            [
                "city",
                "companyName",
                "country",
                "countryArea",
                "firstName",
                "lastName",
                "phone",
                "postalCode",
                "streetAddress1",
                "streetAddress2",
            ] as Array<keyof AddressTypeInput>
        )
            .map((key) => formData[key])
            .some((field) => field !== "");

        if (areAddressInputFieldsModified) {
            handleSubmitWithAddress(formData);
        } else {
            onSubmit({
                address: null,
                customerFirstName: formData.customerFirstName,
                customerLastName: formData.customerLastName,
                email: formData.email,
                note: formData.note,
            });
        }
    };

    return (
        <Form initial={initialForm} onSubmit={handleSubmit} confirmLeave>
            {({ change, data, hasChanged, submit }) => {
                const handleCountrySelect = createSingleAutocompleteSelectHandler(
                    change,
                    setCountryDisplayName,
                    countryChoices
                );

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            <FormattedMessage {...sectionNames.customers} />
                        </Backlink>
                        <PageHeader
                            title={intl.formatMessage({
                                defaultMessage: "Create Customer",
                                id: "N76zUg",
                                description: "page header",
                            })}
                        />
                        <Grid>
                            <div>
                                <CustomerCreateDetails
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <CustomerCreateAddress
                                    countries={countryChoices}
                                    countryDisplayName={countryDisplayName}
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                    onCountryChange={handleCountrySelect}
                                />
                                <CardSpacer />
                                <CustomerCreateNote
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || !hasChanged}
                            state={saveButtonBar}
                            onSubmit={submit}
                            onCancel={onBack}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};
CustomerCreatePage.displayName = "CustomerCreatePage";
export default CustomerCreatePage;
