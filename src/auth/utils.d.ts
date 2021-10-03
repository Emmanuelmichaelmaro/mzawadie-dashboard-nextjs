import { ApolloError } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/messages";
import { UseNotifierResult } from "@mzawadie/hooks/useNotifier";
import { IntlShape } from "react-intl";
export declare enum TOKEN_STORAGE_KEY {
    AUTH = "auth",
    CSRF = "csrf"
}
export declare const getTokens: () => {
    auth: string | null;
    refresh: string | null;
};
export declare const setTokens: (auth: string, csrf: string, persist: boolean) => void;
export declare const setAuthToken: (auth: string, persist: boolean) => void;
export declare const removeTokens: () => void;
export declare const displayDemoMessage: (intl: IntlShape, notify: UseNotifierResult) => void;
export declare function handleQueryAuthError(error: ApolloError, notify: IMessageContext, tokenRefresh: () => Promise<boolean>, logout: () => void, intl: IntlShape): Promise<void>;
