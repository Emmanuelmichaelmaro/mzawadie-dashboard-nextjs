import { defineMessages } from "react-intl";

export const actionButtonsMessages = defineMessages({
    refund: {
        defaultMessage: "Refund",
        id: "K//bUK",
        description: "refund button",
    },
    editTracking: {
        defaultMessage: "Edit tracking",
        id: "dTkmON",
        description: "edit tracking button",
    },
    addTracking: {
        defaultMessage: "Add tracking",
        id: "bS7A8u",
        description: "add tracking button",
    },
});

export const extraInfoMessages = defineMessages({
    fulfilled: {
        defaultMessage: "Fulfilled from: ",
        id: "lOMgms",
        description: "fulfillment group",
    },
    restocked: {
        defaultMessage: "Restocked from: ",
        id: "f/R1Ln",
        description: "restocked group",
    },
    tracking: {
        defaultMessage: "Tracking Number: {trackingNumber}",
        id: "4PlW0w",
        description: "tracking number",
    },
});
