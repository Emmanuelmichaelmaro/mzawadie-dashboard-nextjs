import { commonMessages } from "@mzawadie/core";
import { DiscountErrorFragment, DiscountErrorCode } from "@mzawadie/graphql";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    alreadyExists: {
        defaultMessage: "Promo code already exists",
        id: "stjHjY",
        description: "error message",
    },
});

function getDiscountErrorMessage(
    err: Omit<DiscountErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case DiscountErrorCode.ALREADY_EXISTS:
                return intl.formatMessage(messages.alreadyExists);
            case DiscountErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case DiscountErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getDiscountErrorMessage;
