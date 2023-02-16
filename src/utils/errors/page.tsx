import { commonMessages } from "@mzawadie/core";
import { PageErrorFragment } from "@mzawadie/fragments/types/PageErrorFragment";
import { PageErrorCode } from "@mzawadie/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    attributeAlreadyAssigned: {
        defaultMessage: "This attribute is already assigned.",
        id: "+hib+V",
        description: "error message",
    },
    duplicatedInputItem: {
        defaultMessage: "Page with these attributes already exists.",
        id: "1H+V6k",
        description: "error message",
    },
    nameAlreadyTaken: {
        defaultMessage: "This name is already taken. Please provide another.",
        id: "N7XGzW",
        description: "error message",
    },
    notFound: {
        defaultMessage: "Page not found.",
        id: "PCoO4D",
        description: "error message",
    },
});

function getPageErrorMessage(
    err: Omit<PageErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case PageErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case PageErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case PageErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            case PageErrorCode.UNIQUE:
                return intl.formatMessage(messages.nameAlreadyTaken);
            case PageErrorCode.ATTRIBUTE_ALREADY_ASSIGNED:
                return intl.formatMessage(messages.attributeAlreadyAssigned);
            case PageErrorCode.DUPLICATED_INPUT_ITEM:
                return intl.formatMessage(messages.duplicatedInputItem);
            case PageErrorCode.NOT_FOUND:
                return intl.formatMessage(messages.notFound);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getPageErrorMessage;
