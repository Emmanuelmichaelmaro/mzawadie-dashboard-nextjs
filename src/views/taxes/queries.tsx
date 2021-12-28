import { gql } from "@apollo/client";
import { TypedQuery } from "@mzawadie/core";
import {
    countryWithTaxesFragment,
    shopTaxesFragment,
    taxTypeFragment,
} from "@mzawadie/fragments/taxes";
import makeQuery from "@mzawadie/hooks/makeQuery";
import { CountryList } from "@mzawadie/views/taxes/types/CountryList";
import { TaxTypeList } from "@mzawadie/views/taxes/types/TaxTypeList";

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
// eslint-disable-next-line @typescript-eslint/ban-types
export const TypedCountryListQuery = TypedQuery<CountryList, {}>(countryList);

const taxTypeList = gql`
    ${taxTypeFragment}
    query TaxTypeList {
        taxTypes {
            ...TaxTypeFragment
        }
    }
`;
// eslint-disable-next-line @typescript-eslint/ban-types
export const useTaxTypeList = makeQuery<TaxTypeList, {}>(taxTypeList);
