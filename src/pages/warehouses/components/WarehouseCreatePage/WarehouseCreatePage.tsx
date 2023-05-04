// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CompanyAddressInput } from "@mzawadie/components/CompanyAddressInput";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { CountryWithCodeFragment, WarehouseErrorFragment } from "@mzawadie/graphql";
import useAddressValidation from "@mzawadie/hooks/useAddressValidation";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { AddressTypeInput } from "@mzawadie/pages/customers/types";
import { warehouseListUrl } from "@mzawadie/pages/warehouses/urls";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@mzawadie/utils/maps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WarehouseInfo } from "../WarehouseInfo";

export interface WarehouseCreatePageFormData extends AddressTypeInput {
    name: string;
}

export interface WarehouseCreatePageProps {
    countries: CountryWithCodeFragment[];
    disabled: boolean;
    errors: WarehouseErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onSubmit: (data: WarehouseCreatePageFormData) => SubmitPromise;
}

const initialForm: WarehouseCreatePageFormData = {
    city: "",
    companyName: "",
    country: "",
    countryArea: "",
    name: "",
    phone: "",
    postalCode: "",
    streetAddress1: "",
    streetAddress2: "",
};

const WarehouseCreatePage: React.FC<WarehouseCreatePageProps> = ({
    countries,
    disabled,
    errors,
    saveButtonBarState,
    onSubmit,
}) => {
    const intl = useIntl();

    const navigate = useNavigator();

    const [displayCountry, setDisplayCountry] = useStateFromProps("");

    const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onSubmit);

    return (
        <Form confirmLeave initial={initialForm} onSubmit={handleSubmit}>
            {({ change, data, submit }) => {
                const countryChoices = mapCountriesToChoices(countries);

                const handleCountryChange = createSingleAutocompleteSelectHandler(
                    change,
                    setDisplayCountry,
                    countryChoices
                );

                return (
                    <Container>
                        <Backlink href={warehouseListUrl()}>
                            <FormattedMessage {...sectionNames.warehouses} />
                        </Backlink>

                        <PageHeader
                            title={intl.formatMessage({
                                id: "GhcypC",
                                defaultMessage: "Create Warehouse",
                                description: "header",
                            })}
                        />

                        <Grid>
                            <div>
                                <WarehouseInfo
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />

                                <CardSpacer />

                                <CompanyAddressInput
                                    countries={countryChoices}
                                    data={data}
                                    disabled={disabled}
                                    displayCountry={displayCountry}
                                    errors={[...errors, ...validationErrors]}
                                    header={intl.formatMessage({
                                        id: "43Nlay",
                                        defaultMessage: "Address Information",
                                        description: "warehouse",
                                    })}
                                    onChange={change}
                                    onCountryChange={handleCountryChange}
                                />
                            </div>
                        </Grid>

                        <Savebar
                            disabled={disabled}
                            onCancel={() => navigate(warehouseListUrl())}
                            onSubmit={submit}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

WarehouseCreatePage.displayName = "WarehouseCreatePage";

export default WarehouseCreatePage;
