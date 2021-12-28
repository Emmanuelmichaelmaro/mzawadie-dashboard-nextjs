// @ts-nocheck
import { ApolloError } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/Messages";
import { commonMessages } from "@mzawadie/core";
import { User } from "@mzawadie/fragments/types/User";
import { UseNotifierResult } from "@mzawadie/hooks/useNotifier";
import { IntlShape } from "react-intl";

import { isJwtError, isTokenExpired } from "./errors";

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum TOKEN_STORAGE_KEY {
    AUTH = "auth",
    CSRF = "csrf",
    USER = "user",
}

export const getTokens = () => ({
    auth:
        localStorage.getItem(TOKEN_STORAGE_KEY.AUTH) || sessionStorage.getItem(TOKEN_STORAGE_KEY.AUTH),
    refresh:
        localStorage.getItem(TOKEN_STORAGE_KEY.CSRF) || sessionStorage.getItem(TOKEN_STORAGE_KEY.CSRF),
});

export const setTokens = (auth: string, csrf: string, persist: boolean) => {
    if (persist) {
        localStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
        localStorage.setItem(TOKEN_STORAGE_KEY.CSRF, csrf);
    } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
        sessionStorage.setItem(TOKEN_STORAGE_KEY.CSRF, csrf);
    }
};

export const setAuthToken = (auth: string, persist: boolean) => {
    if (persist) {
        localStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
    } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY.AUTH, auth);
    }
};

export const removeTokens = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY.AUTH);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY.AUTH);
    // localStorage.removeItem(TOKEN_STORAGE_KEY.CSRF);
    // sessionStorage.removeItem(TOKEN_STORAGE_KEY.CSRF);
};

export const getUserData = () =>
    JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY.USER)) ||
    JSON.parse(sessionStorage.getItem(TOKEN_STORAGE_KEY.USER));

export const setUserData = (user: User, persist: boolean) => {
    if (persist) {
        localStorage.setItem(TOKEN_STORAGE_KEY.USER, JSON.stringify(user));
    } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY.USER, JSON.stringify(user));
    }
};

export const removeUserData = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY.USER);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY.USER);
};

export const displayDemoMessage = (intl: IntlShape, notify: UseNotifierResult) => {
    notify({
        text: intl.formatMessage(commonMessages.demo),
    });
};

export async function handleQueryAuthError(
    error: ApolloError,
    notify: IMessageContext,
    tokenRefresh: () => Promise<boolean>,
    logout: () => void,
    intl: IntlShape
) {
    if (error.graphQLErrors.some(isJwtError)) {
        if (error.graphQLErrors.every(isTokenExpired)) {
            const success = await tokenRefresh();

            console.log(JSON.stringify(success));

            if (!success) {
                logout();
                notify({
                    status: "error",
                    text: intl.formatMessage(commonMessages.sessionExpired),
                });
            }
        } else {
            logout();
            notify({
                status: "error",
                text: intl.formatMessage(commonMessages.somethingWentWrong),
            });
        }
    } else if (
        !error.graphQLErrors.every((err) => err.extensions?.exception?.code === "PermissionDenied")
    ) {
        notify({
            status: "error",
            text: intl.formatMessage(commonMessages.somethingWentWrong),
        });
    }
}
