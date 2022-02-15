import { webhooksFragment } from "@mzawadie/fragments/webhooks";
import makeQuery from "@mzawadie/hooks/makeQuery";
import gql from "graphql-tag";

import { WebhookDetails, WebhookDetailsVariables } from "./types/WebhookDetails";

const webhooksDetails = gql`
    ${webhooksFragment}
    query WebhookDetails($id: ID!) {
        webhook(id: $id) {
            ...WebhookFragment
            events {
                eventType
            }
            secretKey
            targetUrl
        }
    }
`;

export const useWebhooksDetailsQuery = makeQuery<WebhookDetails, WebhookDetailsVariables>(
    webhooksDetails
);
