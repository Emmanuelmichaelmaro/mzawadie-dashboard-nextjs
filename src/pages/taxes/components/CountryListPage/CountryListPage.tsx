// @ts-nocheck
import { Container } from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames, maybe } from "@mzawadie/core";
import { CountryListQuery } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CountryList } from "../CountryList";
import { TaxConfiguration } from "../TaxConfiguration";

export interface TaxesConfigurationFormData {
    includeTax: boolean;
    showGross: boolean;
    chargeTaxesOnShipping: boolean;
}
export interface CountryListPageProps {
    disabled: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    shop: CountryListQuery["shop"];
    onBack: () => void;
    onRowClick: (code: string) => void;
    onSubmit: (data: TaxesConfigurationFormData) => SubmitPromise;
    onTaxFetch: () => void;
}

const CountryListPage: React.FC<CountryListPageProps> = ({
    disabled,
    saveButtonBarState,
    shop,
    onBack,
    onRowClick,
    onSubmit,
    onTaxFetch,
}) => {
    const intl = useIntl();

    const initialForm: TaxesConfigurationFormData = {
        chargeTaxesOnShipping: maybe(() => shop.chargeTaxesOnShipping, false),
        includeTax: maybe(() => shop.includeTaxesInPrices, false),
        showGross: maybe(() => shop.displayGrossPrices, false),
    };
    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
            {({ change, data, hasChanged, submit }) => (
                <>
                    <Container>
                        <Backlink onClick={onBack}>
                            {intl.formatMessage(sectionNames.configuration)}
                        </Backlink>
                        <PageHeader
                            title={intl.formatMessage({
                                defaultMessage: "Taxes",
                                id: "lnQAos",
                                description: "header",
                            })}
                        />
                        <Grid variant="inverted">
                            <div>
                                <TaxConfiguration
                                    data={data}
                                    disabled={disabled}
                                    onChange={(event) => change(event)}
                                    onTaxFetch={onTaxFetch}
                                />
                            </div>
                            <div>
                                <CountryList
                                    countries={maybe(() => shop.countries)}
                                    onRowClick={onRowClick}
                                />
                            </div>
                        </Grid>
                    </Container>
                    <Savebar
                        disabled={disabled || !hasChanged}
                        state={saveButtonBarState}
                        onCancel={onBack}
                        onSubmit={submit}
                    />
                </>
            )}
        </Form>
    );
};

CountryListPage.displayName = "CountryListPage";

export default CountryListPage;
