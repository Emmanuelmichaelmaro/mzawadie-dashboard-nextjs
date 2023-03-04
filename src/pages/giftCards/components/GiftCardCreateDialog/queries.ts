import { gql } from "@apollo/client";
import makeQuery from "@mzawadie/hooks/graphql/makeQuery";

import { ChannelCurrencies } from "./types/ChannelCurrencies";

const channelCurrencies = gql`
    query ChannelCurrencies {
        shop {
            channelCurrencies
        }
    }
`;
export const useChannelCurrencies = makeQuery<ChannelCurrencies, {}>(channelCurrencies);
