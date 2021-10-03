import { ApolloClient } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/messages";
import { User } from "@mzawadie/fragments/types/User";
import { MutableRefObject } from "react";
import { IntlShape } from "react-intl";
export interface UseAuthProvider {
    logout: () => void;
    tokenAuthLoading: boolean;
    tokenRefresh: () => Promise<boolean>;
    tokenVerifyLoading: boolean;
    user?: User;
    autoLoginPromise?: MutableRefObject<Promise<any> | undefined>;
}
export interface UseAuthProviderOpts {
    intl: IntlShape;
    notify: IMessageContext;
    apolloClient: ApolloClient<any>;
}
export declare const useAuthProvider: (opts: UseAuthProviderOpts) => {
    login: (username: string, password: string) => Promise<import("../types/TokenAuth").TokenAuth_tokenCreate | null | undefined>;
    loginByExternalPlugin: (input: import("@mzawadie/auth/hooks/useExternalAuthProvider").ExternalLoginInput) => Promise<import("../types/ExternalObtainAccessTokens").ExternalObtainAccessTokens_externalObtainAccessTokens | null | undefined>;
    loginByToken: (auth: string, csrf: string, user: User) => void;
    requestLoginByExternalPlugin: (pluginId: string, input: import("@mzawadie/auth/hooks/useExternalAuthProvider").RequestExternalLoginInput) => Promise<void>;
    logout: () => void;
    tokenAuthLoading: boolean;
    tokenRefresh: () => Promise<boolean>;
    tokenVerifyLoading: boolean;
    user?: User | undefined;
    autoLoginPromise?: MutableRefObject<Promise<any> | undefined> | undefined;
};
