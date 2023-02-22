import { gql } from "@apollo/client";
import { fragmentGiftCardsSettings } from "@mzawadie/fragments/giftCards";
import makeQuery from "@mzawadie/hooks/makeQuery";

import { GiftCardSettings } from "./types/GiftCardSettings";

export const giftCardSettings = gql`
    ${fragmentGiftCardsSettings}
    query GiftCardSettings {
        giftCardSettings {
            ...GiftCardsSettingsFragment
        }
    }
`;

export const useGiftCardSettingsQuery = makeQuery<GiftCardSettings, never>(giftCardSettings);
