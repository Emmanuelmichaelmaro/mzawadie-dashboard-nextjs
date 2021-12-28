// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { maybe } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import React from "react";

import CountryTaxesPage from "../components/CountryTaxesPage";
import { TypedCountryListQuery } from "../queries";
import { countryListUrl } from "../urls";

export interface CountryTaxesParams {
    code: string;
}

export const CountryTaxes: React.FC<CountryTaxesParams> = ({ code }) => {
    const navigate = useNavigator();

    return (
        <TypedCountryListQuery displayLoader>
            {({ data }) => {
                const country = maybe(() =>
                    data?.shop.countries.find((country) => country.code === code)
                );
                return (
                    <CountryTaxesPage
                        countryName={maybe(() => country?.country)}
                        taxCategories={maybe(() => country?.vat?.reducedRates)}
                        onBack={() => navigate(countryListUrl)}
                    />
                );
            }}
        </TypedCountryListQuery>
    );
};

export default CountryTaxes;
