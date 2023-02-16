import { defineMessages } from "react-intl";

export const messages = defineMessages({
    reservedStock: {
        defaultMessage: "Reserved stock",
        id: "X7fqfM",
        description: "title",
    },
    checkoutLimits: {
        defaultMessage: "Checkout limits",
        id: "8uo4v1",
        description: "title",
    },
    reservedStockDescription: {
        defaultMessage:
            "Set up time amount that stock in checkout is reserved for the customer. You can set separate values for authenticated and anonymous customers.",
        id: "C4aDMy",
        description: "description",
    },
    stockReservationForAuthenticatedUser: {
        defaultMessage: "Stock reservation for authenticated user (in minutes)",
        id: "OaKyz4",
        description: "input label",
    },
    stockReservationForAnonymousUser: {
        defaultMessage: "Stock reservation for anonymous user (in minutes)",
        id: "+T0oJ7",
        description: "input label",
    },
    checkoutLineLimit: {
        defaultMessage: "Checkout line limit",
        id: "QclvqG",
        description: "input label",
    },
    stockWillNotBeReserved: {
        defaultMessage: "Leaving this setting empty will mean that stock won’t be reserved",
        id: "YEv+6G",
        description: "input helper text",
    },
    checkoutLimitsDescription: {
        defaultMessage:
            "This number defines quantity of items in checkout line that can be bought. You can override this setting per variant. Leaving this setting empty mean that there is no limits.",
        id: "+do3gl",
        description: "input helper text",
    },
});
