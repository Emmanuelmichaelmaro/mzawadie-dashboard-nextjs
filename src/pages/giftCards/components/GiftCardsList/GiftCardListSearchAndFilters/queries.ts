import { gql } from "@apollo/client";
import makeQuery from "@mzawadie/hooks/makeQuery";

import { GiftCardCurrencies } from "./types/GiftCardCurrencies";

const useGiftCardCurrencies = gql`
    query GiftCardCurrencies {
        giftCardCurrencies
    }
`;

export const useGiftCardCurrenciesQuery = makeQuery<GiftCardCurrencies, {}>(useGiftCardCurrencies);
