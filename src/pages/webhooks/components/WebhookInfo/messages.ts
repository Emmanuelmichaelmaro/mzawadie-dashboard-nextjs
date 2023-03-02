import { defineMessages } from "react-intl";

export const messages = defineMessages({
    webhookInformation: {
        defaultMessage: "Webhook Information",
        id: "WDy0tF",
        description: "section header",
    },
    webhookName: {
        defaultMessage: "Webhook Name",
        id: "D0KaT6",
        description: "webhook input label",
    },
    targetUrl: {
        defaultMessage: "Target URL",
        id: "u9/vj9",
        description: "webhook input label",
    },
    secretKey: {
        defaultMessage: "Secret Key",
        id: "NPfmdK",
        description: "webhook input label",
    },
    targetUrlDescription: {
        defaultMessage: "This URL will receive webhook POST requests",
        id: "0MetrR",
        description: "webhook input help text",
    },
    secretKeyDescription: {
        defaultMessage:
            "secret key is used to create a hash signature with each payload. *optional field",
        id: "tA5HJx",
        description: "webhook input help text",
    },
});
