import CardSpacer from "@mzawadie/components/CardSpacer";
import CompanyAddressInput from "@mzawadie/components/CompanyAddressInput";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ShopInfo_shop_countries } from "@mzawadie/components/Shop/types/ShopInfo";
import { sectionNames } from "@mzawadie/core";
import { WarehouseErrorFragment } from "@mzawadie/fragments/types/WarehouseErrorFragment";
import useAddressValidation from "@mzawadie/hooks/useAddressValidation";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@mzawadie/utils/maps";
import { AddressTypeInput } from "@mzawadie/views/customers/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import WarehouseInfo from "../WarehouseInfo";

export interface WarehouseCreatePageFormData extends AddressTypeInput {
    name: string;
}
export interface WarehouseCreatePageProps {
    countries: ShopInfo_shop_countries[];
    disabled: boolean;
    errors: WarehouseErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: WarehouseCreatePageFormData) => void;
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
    onBack,
    onSubmit,
}) => {
    const intl = useIntl();
    const [displayCountry, setDisplayCountry] = useStateFromProps("");

    const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onSubmit);

    return (
        <Form initial={initialForm} onSubmit={handleSubmit}>
            {({ change, data, submit }) => {
                const countryChoices = mapCountriesToChoices(countries);
                const handleCountryChange = createSingleAutocompleteSelectHandler(
                    change,
                    setDisplayCountry,
                    countryChoices
                );

                return (
                    <Container>
                        <Backlink onClick={onBack}>
                            <FormattedMessage {...sectionNames.warehouses} />
                        </Backlink>
                        <PageHeader
                            title={intl.formatMessage({
                                defaultMessage: "Create Warehouse",
                                id: "GhcypC",
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
                                        defaultMessage: "Address Information",
                                        id: "43Nlay",
                                        description: "warehouse",
                                    })}
                                    onChange={change}
                                    onCountryChange={handleCountryChange}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled}
                            onCancel={onBack}
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
