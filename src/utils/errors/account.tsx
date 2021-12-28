import { commonMessages } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import { AccountErrorCode } from "@mzawadie/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
    invalidPassword: {
        defaultMessage: "Invalid password",
        id: "eu98dw",
    },
    outOfScopeGroup: {
        defaultMessage: "Group is out of your permission scope",
        id: "1n1tOR",
    },
    outOfScopeUser: {
        defaultMessage: "User is out of your permissions scope",
        id: "KRqgfo",
    },
    passwordNumeric: {
        defaultMessage: "Password cannot be entirely numeric",
        id: "cY42ht",
    },
    tooCommon: {
        defaultMessage: "This password is too commonly used",
        id: "wn3di2",
    },
    tooShort: {
        defaultMessage: "This password is too short",
        id: "LR3HlT",
    },
    tooSimilar: {
        defaultMessage: "These passwords are too similar",
        id: "1wyZpQ",
    },
    unique: {
        defaultMessage: "This needs to be unique",
        id: "TDhHMi",
    },
});

function getAccountErrorMessage(err: AccountErrorFragment, intl: IntlShape): string | undefined {
    if (err) {
        switch (err.code) {
            case AccountErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case AccountErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            case AccountErrorCode.INVALID_PASSWORD:
                return intl.formatMessage(messages.invalidPassword);
            case AccountErrorCode.OUT_OF_SCOPE_USER:
                return intl.formatMessage(messages.outOfScopeUser);
            case AccountErrorCode.OUT_OF_SCOPE_GROUP:
                return intl.formatMessage(messages.outOfScopeGroup);
            case AccountErrorCode.PASSWORD_ENTIRELY_NUMERIC:
                return intl.formatMessage(messages.passwordNumeric);
            case AccountErrorCode.PASSWORD_TOO_COMMON:
                return intl.formatMessage(messages.tooCommon);
            case AccountErrorCode.PASSWORD_TOO_SHORT:
                return intl.formatMessage(messages.tooShort);
            case AccountErrorCode.PASSWORD_TOO_SIMILAR:
                return intl.formatMessage(messages.tooSimilar);
            case AccountErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case AccountErrorCode.UNIQUE:
                return intl.formatMessage(messages.unique);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getAccountErrorMessage;
