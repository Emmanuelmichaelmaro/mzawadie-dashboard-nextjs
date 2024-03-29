import { commonMessages } from "@mzawadie/core";
import { OrderErrorFragment, OrderErrorCode } from "@mzawadie/graphql";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    billingNotSet: {
        defaultMessage: "Billing address is not set",
        id: "IFWHn0",
        description: "error message",
    },
    cannotCancelFulfillment: {
        defaultMessage: "This fulfillment cannot be cancelled",
        id: "ij7olm",
        description: "error message",
    },
    cannotCancelOrder: {
        defaultMessage: "This order cannot be cancelled",
        id: "BM1JiJ",
        description: "error message",
    },
    cannotFulfillLine: {
        defaultMessage: "Not enough items to fulfill",
        id: "nOo0oL",
        description: "error message",
    },
    cannotRefund: {
        defaultMessage: "Manual payments can not be refunded",
        id: "Xb6BJ9",
        description: "error message",
    },
    cannotVoid: {
        defaultMessage: "Only pre-authorized payments can be voided",
        id: "sZ27WU",
        description: "error message",
    },
    captureInactive: {
        defaultMessage: "Only pre-authorized payments can be captured",
        id: "gKdGxP",
        description: "error message",
    },
    insufficientStock: {
        defaultMessage: "Cannot change the quantity because of insufficient stock",
        id: "d9UqaJ",
        description: "error message",
    },
    noShippingAddress: {
        defaultMessage: "Cannot choose a shipping method for an order without the shipping address",
        id: "Wlc67M",
        description: "error message",
    },
    notEditable: {
        defaultMessage: "Only draft orders can be edited",
        id: "r+8q4B",
        description: "error message",
    },
    paymentMissing: {
        defaultMessage: "There's no payment associated with the order",
        id: "Y1B0PN",
        description: "error message",
    },
    shippingNotApplicable: {
        defaultMessage: "Shipping method is not valid for chosen shipping address",
        id: "VEE4gD",
        description: "error message",
    },
    shippingRequired: {
        defaultMessage: "Shipping method is required for this order",
        id: "ychKsb",
        description: "error message",
    },
});

function getOrderErrorMessage(err: OrderErrorFragment, intl: IntlShape): string | undefined {
    if (err) {
        switch (err.code) {
            case OrderErrorCode.BILLING_ADDRESS_NOT_SET:
                return intl.formatMessage(messages.billingNotSet);
            case OrderErrorCode.CANNOT_CANCEL_FULFILLMENT:
                return intl.formatMessage(messages.cannotCancelFulfillment);
            case OrderErrorCode.CANNOT_CANCEL_ORDER:
                return intl.formatMessage(messages.cannotCancelOrder);
            case OrderErrorCode.CANNOT_REFUND:
                return intl.formatMessage(messages.cannotRefund);
            case OrderErrorCode.CAPTURE_INACTIVE_PAYMENT:
                return intl.formatMessage(messages.captureInactive);
            case OrderErrorCode.FULFILL_ORDER_LINE:
                return intl.formatMessage(messages.cannotFulfillLine);
            case OrderErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case OrderErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            case OrderErrorCode.INSUFFICIENT_STOCK:
                return intl.formatMessage(messages.insufficientStock);
            case OrderErrorCode.NOT_EDITABLE:
                return intl.formatMessage(messages.notEditable);
            case OrderErrorCode.ORDER_NO_SHIPPING_ADDRESS:
                return intl.formatMessage(messages.noShippingAddress);
            case OrderErrorCode.PAYMENT_MISSING:
                return intl.formatMessage(messages.paymentMissing);
            case OrderErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case OrderErrorCode.SHIPPING_METHOD_NOT_APPLICABLE:
                return intl.formatMessage(messages.shippingNotApplicable);
            case OrderErrorCode.SHIPPING_METHOD_REQUIRED:
                return intl.formatMessage(messages.shippingRequired);
            case OrderErrorCode.VOID_INACTIVE_PAYMENT:
                return intl.formatMessage(messages.cannotVoid);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getOrderErrorMessage;
