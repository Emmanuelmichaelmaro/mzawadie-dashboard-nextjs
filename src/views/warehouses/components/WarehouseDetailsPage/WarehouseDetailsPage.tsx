// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import CompanyAddressInput from "@mzawadie/components/CompanyAddressInput";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ShopInfo_shop_countries } from "@mzawadie/components/Shop/types/ShopInfo";
import { findValueInEnum, maybe, sectionNames } from "@mzawadie/core";
import { WarehouseErrorFragment } from "@mzawadie/fragments/types/WarehouseErrorFragment";
import useAddressValidation from "@mzawadie/hooks/useAddressValidation";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { CountryCode } from "@mzawadie/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices, mapEdgesToItems } from "@mzawadie/utils/maps";
import { AddressTypeInput } from "@mzawadie/views/customers/types";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WarehouseDetails_warehouse } from "../../types/WarehouseDetails";
import WarehouseInfo from "../WarehouseInfo";
import WarehouseZones from "../WarehouseZones";

export interface WarehouseDetailsPageFormData extends AddressTypeInput {
    name: string;
}
export interface WarehouseDetailsPageProps {
    countries: ShopInfo_shop_countries[];
    disabled: boolean;
    errors: WarehouseErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    warehouse: WarehouseDetails_warehouse;
    onBack: () => void;
    onDelete: () => void;
    onShippingZoneClick: (id: string) => void;
    onSubmit: (data: WarehouseDetailsPageFormData) => SubmitPromise;
}

const WarehouseDetailsPage: React.FC<WarehouseDetailsPageProps> = ({
    countries,
    disabled,
    errors,
    saveButtonBarState,
    warehouse,
    onBack,
    onDelete,
    onShippingZoneClick,
    onSubmit,
}) => {
    const intl = useIntl();
    const [displayCountry, setDisplayCountry] = useStateFromProps(
        warehouse?.address?.country.country || ""
    );

    const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onSubmit);

    const initialForm: WarehouseDetailsPageFormData = {
        city: maybe(() => warehouse.address.city, ""),
        companyName: maybe(() => warehouse.address.companyName, ""),
        country: maybe(() => findValueInEnum(warehouse.address.country.code, CountryCode)),
        countryArea: maybe(() => warehouse.address.countryArea, ""),
        name: maybe(() => warehouse.name, ""),
        phone: maybe(() => warehouse.address.phone, ""),
        postalCode: maybe(() => warehouse.address.postalCode, ""),
        streetAddress1: maybe(() => warehouse.address.streetAddress1, ""),
        streetAddress2: maybe(() => warehouse.address.streetAddress2, ""),
    };

    return (
        <Form initial={initialForm} onSubmit={handleSubmit}>
            {({ change, data, hasChanged, submit }) => {
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
                        <PageHeader title={warehouse?.name} />
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
                            <div>
                                <WarehouseZones
                                    zones={mapEdgesToItems(warehouse?.shippingZones)}
                                    onShippingZoneClick={onShippingZoneClick}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || !hasChanged}
                            onCancel={onBack}
                            onDelete={onDelete}
                            onSubmit={submit}
                            state={saveButtonBarState}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

WarehouseDetailsPage.displayName = "WarehouseDetailsPage";
export default WarehouseDetailsPage;
