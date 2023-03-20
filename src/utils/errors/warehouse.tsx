import { commonMessages } from "@mzawadie/core";
import { WarehouseErrorFragment, WarehouseErrorCode } from "@mzawadie/graphql";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    slugUnique: {
        defaultMessage: "Slug must be unique for each warehouse",
        id: "nKjLjT",
        description: "error message",
    },
});

function getWarehouseErrorMessage(
    err: Omit<WarehouseErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case WarehouseErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case WarehouseErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case WarehouseErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export function getWarehouseSlugErrorMessage(
    err: Omit<WarehouseErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        if (err.code === WarehouseErrorCode.UNIQUE) {
            return intl.formatMessage(messages.slugUnique);
        }
        return getWarehouseErrorMessage(err, intl);
    }

    return undefined;
}

export default getWarehouseErrorMessage;
