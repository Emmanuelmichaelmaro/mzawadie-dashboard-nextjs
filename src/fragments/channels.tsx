/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const channelErrorFragment = gql`
    fragment ChannelErrorFragment on ChannelError {
        code
        field
        message
    }
`;

export const channelFragment = gql`
    fragment ChannelFragment on Channel {
        id
        isActive
        name
        slug
        currencyCode
    }
`;

export const channelDetailsFragment = gql`
    ${channelFragment}
    fragment ChannelDetailsFragment on Channel {
        ...ChannelFragment
        hasOrders
    }
`;
