import { gql } from "@apollo/client";
import makeQuery from "@mzawadie/hooks/makeQuery";

import { ChannelCurrencies } from "./types/ChannelCurrencies";

const channelCurrencies = gql`
    query ChannelCurrencies {
        shop {
            channelCurrencies
        }
    }
`;
export const useChannelCurrencies = makeQuery<ChannelCurrencies, {}>(channelCurrencies);
