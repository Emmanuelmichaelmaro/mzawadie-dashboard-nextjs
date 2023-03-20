import { commonMessages } from "@mzawadie/core";
import { AttributeErrorFragment, AttributeErrorCode } from "@mzawadie/graphql";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    alreadyExists: {
        defaultMessage: "An attribute already exists.",
        id: "KFv8hX",
    },
    nameAlreadyTaken: {
        defaultMessage: "This name is already taken. Please provide another.",
        id: "FuAV5G",
    },
    notFound: {
        defaultMessage: "Attribute not found.",
        id: "SKFr04",
    },
});

function getAttributeErrorMessage(
    err: Omit<AttributeErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case AttributeErrorCode.ALREADY_EXISTS:
                return intl.formatMessage(messages.alreadyExists);
            case AttributeErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case AttributeErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case AttributeErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            case AttributeErrorCode.UNIQUE:
                return intl.formatMessage(messages.nameAlreadyTaken);
            case AttributeErrorCode.NOT_FOUND:
                return intl.formatMessage(messages.notFound);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getAttributeErrorMessage;
