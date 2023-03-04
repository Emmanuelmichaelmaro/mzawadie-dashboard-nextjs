import { gql } from "@apollo/client";
import makeMutation from "@mzawadie/hooks/graphql/makeMutation";

import { GiftCardBulkCreate, GiftCardBulkCreateVariables } from "./types/GiftCardBulkCreate";

const giftCardBulkCreate = gql`
    mutation GiftCardBulkCreate($input: GiftCardBulkCreateInput!) {
        giftCardBulkCreate(input: $input) {
            giftCards {
                id
            }
            errors {
                code
                field
            }
        }
    }
`;

export const useGiftCardBulkCreateMutation = makeMutation<
    GiftCardBulkCreate,
    GiftCardBulkCreateVariables
>(giftCardBulkCreate);
