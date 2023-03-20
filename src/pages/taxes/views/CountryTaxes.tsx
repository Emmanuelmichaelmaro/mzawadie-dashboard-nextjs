// @ts-nocheck
import { useCountryListQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { CountryTaxesPage } from "@mzawadie/pages/taxes/components/CountryTaxesPage";
import { countryListUrl } from "@mzawadie/pages/taxes/urls";
import React from "react";

export interface CountryTaxesParams {
    code: string;
}

export const CountryTaxes: React.FC<CountryTaxesParams> = ({ code }) => {
    const navigate = useNavigator();

    const { data } = useCountryListQuery({
        displayLoader: true,
    });

    const country = data?.shop.countries.find((country) => country.code === code);

    return (
        <CountryTaxesPage
            countryName={country?.country}
            taxCategories={country?.vat.reducedRates}
            onBack={() => navigate(countryListUrl)}
        />
    );
};

export default CountryTaxes;
