import { commonMessages } from "@mzawadie/core";
import { ShopErrorFragment } from "@mzawadie/fragments/types/ShopErrorFragment";
import { ShopErrorCode } from "@mzawadie/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    alreadyExists: {
        defaultMessage: "Authorization key with this type already exists",
        id: "m8cjcK",
        description: "add authorization key error",
    },
});

function getShopErrorMessage(
    err: Omit<ShopErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case ShopErrorCode.ALREADY_EXISTS:
                return intl.formatMessage(messages.alreadyExists);
            case ShopErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case ShopErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case ShopErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getShopErrorMessage;
