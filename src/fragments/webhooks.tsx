/* eslint-disable import/prefer-default-export */
import { gql } from "@apollo/client";

export const webhooksFragment = gql`
    fragment WebhookFragment on Webhook {
        id
        name
        isActive
        app {
            id
            name
        }
    }
`;

export const webhooksDetailsFragment = gql`
    ${webhooksFragment}
    fragment WebhooksDetailsFragment on Webhook {
        ...WebhookFragment
    }
`;
