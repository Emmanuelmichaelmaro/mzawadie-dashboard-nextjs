import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { countryFragment, shopTaxesFragment } from "@mzawadie/fragments/taxes";
import makeMutation from "@mzawadie/hooks/makeMutation";

import { FetchTaxes } from "./types/FetchTaxes";
import { UpdateTaxSettings, UpdateTaxSettingsVariables } from "./types/UpdateTaxSettings";

const updateTaxSettings = gql`
    ${shopTaxesFragment}
    mutation UpdateTaxSettings($input: ShopSettingsInput!) {
        shopSettingsUpdate(input: $input) {
            errors {
                field
                message
            }
            shop {
                ...ShopTaxesFragment
            }
        }
    }
`;

export const useTaxSettingsUpdateMutation = makeMutation<UpdateTaxSettings, UpdateTaxSettingsVariables>(
    updateTaxSettings
);

const fetchTaxes = gql`
    ${countryFragment}
    mutation FetchTaxes {
        shopFetchTaxRates {
            errors {
                field
                message
            }
            shop {
                countries {
                    ...CountryFragment
                }
            }
        }
    }
`;
export const TypedFetchTaxes = TypedMutation<FetchTaxes, {}>(fetchTaxes);
