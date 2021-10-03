/* eslint-disable @typescript-eslint/require-await */
import { useApolloClient } from "@apollo/client";
import { getTokens } from "@mzawadie/auth";
import { useAuthProvider } from "@mzawadie/auth/hooks/useAuthProvider";
import {
    ExternalLoginInput,
    RequestExternalLoginInput,
} from "@mzawadie/auth/hooks/useExternalAuthProvider";
import { ExternalObtainAccessTokens_externalObtainAccessTokens } from "@mzawadie/auth/types/ExternalObtainAccessTokens";
import { TokenAuth_tokenCreate } from "@mzawadie/auth/types/TokenAuth";
import { User } from "@mzawadie/fragments/types/User";
import useNotifier from "@mzawadie/hooks/useNotifier";
import React, { createContext, MutableRefObject, useContext } from "react";
import { useIntl } from "react-intl";

interface UserContextProps {
    autoLoginPromise?: MutableRefObject<Promise<any> | undefined>;
    login: (username: string, password: string) => Promise<TokenAuth_tokenCreate | null | undefined>;
    loginByToken: (auth: string, csrf: string, user: User) => void;
    loginByExternalPlugin: (
        input: ExternalLoginInput
    ) => Promise<ExternalObtainAccessTokens_externalObtainAccessTokens | null | undefined>;
    requestLoginByExternalPlugin: (pluginId: string, input: RequestExternalLoginInput) => Promise<void>;
    logout: () => void;
    tokenAuthLoading: boolean;
    tokenRefresh: () => Promise<boolean | undefined>;
    tokenVerifyLoading: boolean;
    user?: User;
}

export const UserContext = createContext<UserContextProps>({
    login: async () => {
        return undefined;
    },
    loginByToken: () => {},
    loginByExternalPlugin: async () => {
        return undefined;
    },
    requestLoginByExternalPlugin: async () => {
        return undefined;
    },
    logout: () => {},
    tokenAuthLoading: false,
    tokenRefresh: async () => {
        return undefined;
    },
    tokenVerifyLoading: false,
});

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const apolloClient = useApolloClient();
    const intl = useIntl();
    const notify = useNotifier();
    const value = useAuthProvider({ apolloClient, intl, notify });
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(UserContext);
    return {
        hasToken: !!getTokens(),
        isLoggedIn: !!context.user,
        tokenAuthLoading: context.tokenAuthLoading,
        tokenVerifyLoading: context.tokenVerifyLoading,
        user: context.user,
    };
};

export default AuthProvider;
