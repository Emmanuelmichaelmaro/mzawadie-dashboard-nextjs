/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CountryWithTaxesFragment
// ====================================================

export interface CountryWithTaxesFragment_vat_reducedRates {
    __typename: "ReducedRate";
    rateType: string;
    rate: number;
}

export interface CountryWithTaxesFragment_vat {
    __typename: "VAT";
    standardRate: number | null;
    reducedRates: (CountryWithTaxesFragment_vat_reducedRates | null)[];
}

export interface CountryWithTaxesFragment {
    __typename: "CountryDisplay";
    country: string;
    code: string;
    vat: CountryWithTaxesFragment_vat | null;
}
