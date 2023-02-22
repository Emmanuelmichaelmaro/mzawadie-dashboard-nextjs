import { gql } from "@apollo/client";
import { giftCardSettingsErrorFragment } from "@mzawadie/fragments/errors";
import { fragmentGiftCardsSettings } from "@mzawadie/fragments/giftCards";
import makeMutation from "@mzawadie/hooks/makeMutation";

import {
    GiftCardSettingsUpdate,
    GiftCardSettingsUpdateVariables,
} from "./types/GiftCardSettingsUpdate";

const giftCardSettingsUpdate = gql`
    ${giftCardSettingsErrorFragment}
    ${fragmentGiftCardsSettings}
    mutation GiftCardSettingsUpdate($input: GiftCardSettingsUpdateInput!) {
        giftCardSettingsUpdate(input: $input) {
            errors {
                ...GiftCardSettingsErrorFragment
            }
            giftCardSettings {
                ...GiftCardsSettingsFragment
            }
        }
    }
`;

export const useGiftCardSettingsUpdateMutation = makeMutation<
    GiftCardSettingsUpdate,
    GiftCardSettingsUpdateVariables
>(giftCardSettingsUpdate);
