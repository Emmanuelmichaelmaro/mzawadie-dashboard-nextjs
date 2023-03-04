import { gql } from "@apollo/client";
import { giftCardErrorFragment } from "@mzawadie/fragments/errors";
import makeMutation from "@mzawadie/hooks/graphql/makeMutation";

import { GiftCardBulkActivate, GiftCardBulkActivateVariables } from "./types/GiftCardBulkActivate";
import {
    GiftCardBulkDeactivate,
    GiftCardBulkDeactivateVariables,
} from "./types/GiftCardBulkDeactivate";

const giftCardBulkActivate = gql`
    ${giftCardErrorFragment}
    mutation GiftCardBulkActivate($ids: [ID]!) {
        giftCardBulkActivate(ids: $ids) {
            errors {
                ...GiftCardError
            }
            count
        }
    }
`;

export const useGiftCardBulkActivateMutation = makeMutation<
    GiftCardBulkActivate,
    GiftCardBulkActivateVariables
>(giftCardBulkActivate);

const giftCardBulkDeactivate = gql`
    ${giftCardErrorFragment}
    mutation GiftCardBulkDeactivate($ids: [ID]!) {
        giftCardBulkDeactivate(ids: $ids) {
            errors {
                ...GiftCardError
            }
            count
        }
    }
`;

export const useGiftCardBulkDeactivateMutation = makeMutation<
    GiftCardBulkDeactivate,
    GiftCardBulkDeactivateVariables
>(giftCardBulkDeactivate);
