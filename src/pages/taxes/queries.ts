import { gql } from "@apollo/client";
import { TypedQuery } from "@mzawadie/core";
import {
    countryWithTaxesFragment,
    shopTaxesFragment,
    taxTypeFragment,
} from "@mzawadie/fragments/taxes";
import makeQuery from "@mzawadie/hooks/graphql/makeQuery";

import { CountryList } from "./types/CountryList";
import { TaxTypeList } from "./types/TaxTypeList";

const countryList = gql`
    ${countryWithTaxesFragment}
    ${shopTaxesFragment}
    query CountryList {
        shop {
            ...ShopTaxesFragment
            countries {
                ...CountryWithTaxesFragment
            }
        }
    }
`;
export const TypedCountryListQuery = TypedQuery<CountryList, {}>(countryList);

const taxTypeList = gql`
    ${taxTypeFragment}
    query TaxTypeList {
        taxTypes {
            ...TaxTypeFragment
        }
    }
`;
export const useTaxTypeList = makeQuery<TaxTypeList, {}>(taxTypeList);
