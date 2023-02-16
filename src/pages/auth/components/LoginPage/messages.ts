import { UserContextError } from "@mzawadie/pages/auth/types";
import { defineMessages, IntlShape } from "react-intl";

export const errorMessages = defineMessages({
    loginError: {
        defaultMessage: "Sorry, your username and/or password are incorrect. Please try again.",
        id: "tTtoKd",
        description: "error message",
    },
    externalLoginError: {
        defaultMessage: "Sorry, login went wrong. Please try again.",
        id: "M4q0Ye",
        description: "error message",
    },
    serverError: {
        defaultMessage: "Saleor is unavailable, please check your network connection and try again.",
        id: "ChGI4V",
        description: "error message",
    },
});

// eslint-disable-next-line consistent-return
export function getErrorMessage(err: UserContextError, intl: IntlShape): string {
    // eslint-disable-next-line default-case
    switch (err) {
        case "loginError":
            return intl.formatMessage(errorMessages.loginError);
        case "externalLoginError":
            return intl.formatMessage(errorMessages.externalLoginError);
        case "serverError":
            return intl.formatMessage(errorMessages.serverError);
    }
}
