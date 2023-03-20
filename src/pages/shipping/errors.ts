// @ts-nocheck
import { ShippingErrorCode } from "@mzawadie/graphql";
import { ShippingErrorFragment } from "@mzawadie/graphqlShippingErrorFragment";
import getShippingErrorMessage from "@mzawadie/utils/errors/shipping";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
    invalid: {
        defaultMessage: "Value is invalid",
        id: "57IYpr",
        description: "error message",
    },
    price: {
        defaultMessage: "Maximum price cannot be lower than minimum",
        id: "pwqwcy",
        description: "error message",
    },
    weight: {
        defaultMessage: "Maximum weight cannot be lower than minimum",
        id: "H27/Gy",
        description: "error message",
    },
});

export function getShippingPriceRateErrorMessage(err: ShippingErrorFragment, intl: IntlShape): string {
    switch (err?.code) {
        case ShippingErrorCode.MAX_LESS_THAN_MIN:
            return intl.formatMessage(messages.price);
        default:
            getShippingErrorMessage(err, intl);
    }
}

export function getShippingWeightRateErrorMessage(err: ShippingErrorFragment, intl: IntlShape): string {
    switch (err?.code) {
        case ShippingErrorCode.MAX_LESS_THAN_MIN:
            return intl.formatMessage(messages.weight);
        case ShippingErrorCode.INVALID:
            return intl.formatMessage(messages.invalid);
        default:
            getShippingErrorMessage(err, intl);
    }
}
