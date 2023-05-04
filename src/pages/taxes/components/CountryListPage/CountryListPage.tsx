// @ts-nocheck
import { Backlink } from "@mzawadie/components/Backlink";
import { Container } from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { CountryListQuery } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
    onSubmit: (data: TaxesConfigurationFormData) => SubmitPromise;
    onTaxFetch: () => void;
}

const CountryListPage: React.FC<CountryListPageProps> = ({
    disabled,
    saveButtonBarState,
    shop,
    onSubmit,
    onTaxFetch,
}) => {
    const intl = useIntl();

    const navigate = useNavigator();

    const initialForm: TaxesConfigurationFormData = {
        chargeTaxesOnShipping: shop?.chargeTaxesOnShipping || false,
        includeTax: shop?.includeTaxesInPrices || false,
        showGross: shop?.displayGrossPrices || false,
    };

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
            {({ change, data, isSaveDisabled, submit }) => (
                <>
                    <Container>
                        <Backlink href={configurationMenuUrl}>
                            {intl.formatMessage(sectionNames.configuration)}
                        </Backlink>

                        <PageHeader
                            title={intl.formatMessage({
                                id: "lnQAos",
                                defaultMessage: "Taxes",
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
                                <CountryList countries={shop?.countries} />
                            </div>
                        </Grid>
                    </Container>

                    <Savebar
                        disabled={isSaveDisabled}
                        state={saveButtonBarState}
                        onCancel={() => navigate(configurationMenuUrl)}
                        onSubmit={submit}
                    />
                </>
            )}
        </Form>
    );
};

CountryListPage.displayName = "CountryListPage";

export default CountryListPage;
