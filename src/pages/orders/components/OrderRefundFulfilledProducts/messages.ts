import { FulfillmentStatus } from "@mzawadie/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

export const messages = defineMessages({
    fulfillment: {
        defaultMessage: "Fulfillment",
        id: "MewrtN",
        description: "section header",
    },
    fulfillmentReturned: {
        defaultMessage: "Fulfillment returned",
        id: "H/f9KR",
        description: "section header returned",
    },
    fulfillmentWaitingForApproval: {
        defaultMessage: "Fulfillment waiting for approval",
        id: "i/ZhxL",
        description: "section header returned",
    },
});

export const getTitle = (fulfillmentStatus: FulfillmentStatus, intl: IntlShape) => {
    switch (fulfillmentStatus) {
        case FulfillmentStatus.RETURNED:
            return intl.formatMessage(messages.fulfillmentReturned);
        case FulfillmentStatus.WAITING_FOR_APPROVAL:
            return intl.formatMessage(messages.fulfillmentWaitingForApproval);
        default:
            return intl.formatMessage(messages.fulfillment);
    }
};
