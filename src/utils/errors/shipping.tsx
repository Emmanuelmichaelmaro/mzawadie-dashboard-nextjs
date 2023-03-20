import { commonMessages } from "@mzawadie/core";
import { ShippingErrorFragment, ShippingErrorCode } from "@mzawadie/graphql";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    alreadyExists: {
        defaultMessage: "Default shipping zone already exists",
        id: "VIABHy",
        description: "error message",
    },
    lessThanMin: {
        defaultMessage: "Max value cannot be less than min value",
        id: "AdmPca",
        description: "error message",
    },
});

function getShippingErrorMessage(
    err: Omit<ShippingErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case ShippingErrorCode.ALREADY_EXISTS:
                return intl.formatMessage(messages.alreadyExists);
            case ShippingErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case ShippingErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case ShippingErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            case ShippingErrorCode.MAX_LESS_THAN_MIN:
                return intl.formatMessage(messages.lessThanMin);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getShippingErrorMessage;
