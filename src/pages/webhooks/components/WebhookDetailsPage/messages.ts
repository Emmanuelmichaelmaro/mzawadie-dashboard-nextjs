import { getStringOrPlaceholder } from "@mzawadie/core";
import { WebhookDetails_webhook } from "@mzawadie/pages/webhooks/types/WebhookDetails";
import { isUnnamed } from "@mzawadie/pages/webhooks/utils";
import { IntlShape, defineMessages } from "react-intl";

export const messages = defineMessages({
    header: {
        defaultMessage: "Unnamed Webhook Details",
        id: "snUby7",
        description: "header",
    },
    headerNamed: {
        defaultMessage: "{webhookName} Details",
        id: "OPtrMg",
        description: "header",
    },
    headerCreate: {
        defaultMessage: "Create Webhook",
        id: "Ryh3iR",
        description: "header",
    },
});

export const getHeaderTitle = (intl: IntlShape, webhook?: WebhookDetails_webhook) => {
    if (!webhook) {
        return intl.formatMessage(messages.headerCreate);
    }
    if (isUnnamed(webhook)) {
        return intl.formatMessage(messages.header);
    }
    return intl.formatMessage(messages.headerNamed, {
        webhookName: getStringOrPlaceholder(webhook?.name),
    });
};
