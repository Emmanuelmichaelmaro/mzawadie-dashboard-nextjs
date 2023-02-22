import { gql } from "@apollo/client";
import { giftCardErrorFragment } from "@mzawadie/fragments/errors";
import makeMutation from "@mzawadie/hooks/makeMutation";

import { giftCardDataFragment } from "../queries";
import { GiftCardResend, GiftCardResendVariables } from "./types/GiftCardResend";

const giftCardResend = gql`
    ${giftCardDataFragment}
    ${giftCardErrorFragment}
    mutation GiftCardResend($input: GiftCardResendInput!) {
        giftCardResend(input: $input) {
            errors {
                ...GiftCardError
            }
            giftCard {
                ...GiftCardData
            }
        }
    }
`;

export const useGiftCardResendCodeMutation = makeMutation<GiftCardResend, GiftCardResendVariables>(
    giftCardResend
);
