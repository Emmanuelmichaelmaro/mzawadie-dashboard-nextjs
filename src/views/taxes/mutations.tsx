import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { countryFragment, shopTaxesFragment } from "@mzawadie/fragments/taxes";
import { FetchTaxes } from "@mzawadie/views/taxes/types/FetchTaxes";
import {
    UpdateTaxSettings,
    UpdateTaxSettingsVariables,
} from "@mzawadie/views/taxes/types/UpdateTaxSettings";

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
export const TypedUpdateTaxSettings = TypedMutation<UpdateTaxSettings, UpdateTaxSettingsVariables>(
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
// eslint-disable-next-line @typescript-eslint/ban-types
export const TypedFetchTaxes = TypedMutation<FetchTaxes, {}>(fetchTaxes);
