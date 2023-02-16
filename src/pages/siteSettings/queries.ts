import { gql } from "@apollo/client";
import { TypedQuery } from "@mzawadie/core";
import { shopFragment } from "@mzawadie/fragments/shop";

import { SiteSettings } from "./types/SiteSettings";

const siteSettings = gql`
    ${shopFragment}
    query SiteSettings {
        shop {
            ...ShopFragment
        }
    }
`;
export const TypedSiteSettingsQuery = TypedQuery<SiteSettings, {}>(siteSettings);
