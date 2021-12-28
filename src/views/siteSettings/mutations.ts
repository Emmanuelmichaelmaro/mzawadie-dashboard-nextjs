import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { fragmentAddress } from "@mzawadie/fragments/address";
import { shopErrorFragment } from "@mzawadie/fragments/errors";
import { shopFragment } from "@mzawadie/fragments/shop";

import { ShopSettingsUpdate, ShopSettingsUpdateVariables } from "./types/ShopSettingsUpdate";

const shopSettingsUpdate = gql`
    ${shopErrorFragment}
    ${shopFragment}
    ${fragmentAddress}
    mutation ShopSettingsUpdate(
        $shopDomainInput: SiteDomainInput!
        $shopSettingsInput: ShopSettingsInput!
        $addressInput: AddressInput
    ) {
        shopSettingsUpdate(input: $shopSettingsInput) {
            errors {
                ...ShopErrorFragment
            }
            shop {
                ...ShopFragment
            }
        }
        shopDomainUpdate(input: $shopDomainInput) {
            errors {
                ...ShopErrorFragment
            }
            shop {
                domain {
                    host
                    url
                }
            }
        }
        shopAddressUpdate(input: $addressInput) {
            errors {
                ...ShopErrorFragment
            }
            shop {
                companyAddress {
                    ...AddressFragment
                }
            }
        }
    }
`;
export const TypedShopSettingsUpdate = TypedMutation<ShopSettingsUpdate, ShopSettingsUpdateVariables>(
    shopSettingsUpdate
);
