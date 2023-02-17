// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { CountryList } from "@mzawadie/components/CountryList";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { CountryFragment } from "@mzawadie/fragments/types/CountryFragment";
import { ShippingErrorFragment } from "@mzawadie/fragments/types/ShippingErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ShippingZoneCountriesAssignDialog } from "../ShippingZoneCountriesAssignDialog";
import { ShippingZoneInfo } from "../ShippingZoneInfo";

export interface ShippingZoneCreateFormData {
    countries: string[];
    description: string;
    name: string;
}

const messages = defineMessages({
    countries: {
        defaultMessage: "Countries",
        id: "55LMJv",
        description: "country list header",
    },
    createZone: {
        defaultMessage: "Create New Shipping Zone",
        id: "6fxdUO",
        description: "section header",
    },
    noCountriesAssigned: {
        defaultMessage: "Currently, there are no countries assigned to this shipping zone",
        id: "y7mfbl",
    },
});

export interface ShippingZoneCreatePageProps {
    countries: CountryFragment[];
    restWorldCountries: string[];
    disabled: boolean;
    errors: ShippingErrorFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: ShippingZoneCreateFormData) => SubmitPromise;
}

const ShippingZoneCreatePage: React.FC<ShippingZoneCreatePageProps> = ({
    countries,
    restWorldCountries,
    disabled,
    errors,
    onBack,
    onSubmit,
    saveButtonBarState,
}) => {
    const intl = useIntl();
    const [isModalOpened, setModalStatus] = React.useState(false);
    const toggleModal = () => setModalStatus(!isModalOpened);

    const initialForm: ShippingZoneCreateFormData = {
        countries: [],
        description: "",
        name: "",
    };

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit }) => (
                <>
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.shipping)}
                        </Backlink>
                        <PageHeader title={intl.formatMessage(messages.createZone)} />
                        <Grid>
                            <div>
                                <ShippingZoneInfo
                                    data={data}
                                    disabled={disabled}
                                    errors={errors}
                                    onChange={change}
                                />
                                <CardSpacer />
                                <CountryList
                                    countries={data.countries.map((selectedCountry) =>
                                        countries.find((country) => country.code === selectedCountry)
                                    )}
                                    disabled={disabled}
                                    emptyText={intl.formatMessage(messages.noCountriesAssigned)}
                                    onCountryAssign={toggleModal}
                                    onCountryUnassign={(countryCode) =>
                                        change({
                                            target: {
                                                name: "countries",
                                                value: data.countries.filter(
                                                    (country) => country !== countryCode
                                                ),
                                            },
                                        } as any)
                                    }
                                    title={intl.formatMessage(messages.countries)}
                                />
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || !hasChanged}
                            onCancel={onBack}
                            onSubmit={submit}
                            state={saveButtonBarState}
                        />
                    </Container>
                    <ShippingZoneCountriesAssignDialog
                        open={isModalOpened}
                        onConfirm={(formData) => {
                            change({
                                target: {
                                    name: "countries",
                                    value: formData.countries,
                                },
                            } as any);
                            toggleModal();
                        }}
                        confirmButtonState="default"
                        countries={countries}
                        restWorldCountries={restWorldCountries}
                        initial={data.countries}
                        onClose={toggleModal}
                    />
                </>
            )}
        </Form>
    );
};

ShippingZoneCreatePage.displayName = "ShippingZoneCreatePage";

export default ShippingZoneCreatePage;
