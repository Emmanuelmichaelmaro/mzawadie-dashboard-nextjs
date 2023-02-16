import { defineMessages } from "react-intl";

export const homeNotificationTableMessages = defineMessages({
    createNewChannel: {
        defaultMessage: "Create new channel",
        id: "Nuq83+",
    },
    noOrders: {
        defaultMessage: "No orders ready to fulfill",
        id: "E9Jssl",
    },
    noPaymentWaiting: {
        defaultMessage: "No payments waiting for capture",
        id: "5dyOs0",
    },
    noProductsOut: {
        defaultMessage: "No products are out of stock",
        id: "bFhzRX",
    },
    orderReady: {
        defaultMessage:
            "{amount, plural,one {One order is ready to fulfill} other {{amount} orders are ready to fulfill}}",
        id: "c0H45L",
    },
    paymentCapture: {
        defaultMessage:
            "{amount, plural,one {One payment to capture}other {{amount} payments to capture}}",
        id: "md326v",
    },
    productOut: {
        defaultMessage:
            "{amount, plural,one {One product out of stock}other {{amount} products out of stock}}",
        id: "cdxwA8",
    },
});
