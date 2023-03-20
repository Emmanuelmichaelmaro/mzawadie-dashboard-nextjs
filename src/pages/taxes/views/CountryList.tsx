import { commonMessages, extractMutationErrors, maybe } from "@mzawadie/core";
import {
    useCountryListQuery,
    useFetchTaxesMutation,
    useUpdateTaxSettingsMutation,
} from "@mzawadie/graphql";
import { useNavigator, useNotifier } from "@mzawadie/hooks";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import {
    CountryListPage,
    TaxesConfigurationFormData,
} from "@mzawadie/pages/taxes/components/CountryListPage";
import { countryTaxRatesUrl } from "@mzawadie/pages/taxes/urls";
import React from "react";
import { useIntl } from "react-intl";

export const CountryList: React.FC = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data, loading } = useCountryListQuery({
        displayLoader: true,
    });

    const [fetchTaxes, fetchTaxesOpts] = useFetchTaxesMutation({
        onCompleted: (data) => {
            if (data.shopFetchTaxRates?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Successfully fetched tax rates",
                        id: "HtQGEH",
                    }),
                });
            } else {
                notify({
                    status: "error",
                    text: intl.formatMessage(commonMessages.somethingWentWrong),
                });
            }
        },
    });

    const [updateTaxSettings, updateTaxSettingsOpts] = useUpdateTaxSettingsMutation({
        onCompleted: (data) => {
            if (data.shopSettingsUpdate?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
            }
        },
    });

    const handleSubmit = (data: TaxesConfigurationFormData) =>
        extractMutationErrors(
            updateTaxSettings({
                variables: {
                    input: {
                        chargeTaxesOnShipping: data.chargeTaxesOnShipping,
                        displayGrossPrices: data.showGross,
                        includeTaxesInPrices: data.includeTax,
                    },
                },
            })
        );

    return (
        <CountryListPage
            disabled={loading || fetchTaxesOpts.loading || updateTaxSettingsOpts.loading}
            onBack={() => navigate(configurationMenuUrl)}
            onRowClick={(code) => navigate(countryTaxRatesUrl(code))}
            onSubmit={handleSubmit}
            onTaxFetch={fetchTaxes}
            saveButtonBarState={updateTaxSettingsOpts.status}
            shop={maybe(() => ({
                ...data?.shop,
                countries: data?.shop.countries.filter((country) => country.vat),
            }))}
        />
    );
};

export default CountryList;
