/* eslint-disable @typescript-eslint/require-await */
import { useApolloClient } from "@apollo/client";
import { User } from "@mzawadie/fragments/types/User";
import useNotifier from "@mzawadie/hooks/useNotifier";
import { useAuthProvider } from "@mzawadie/views/auth/hooks/useAuthProvider";
import {
    ExternalLoginInput,
    RequestExternalLoginInput,
} from "@mzawadie/views/auth/hooks/useExternalAuthProvider";
import { ExternalObtainAccessTokens_externalObtainAccessTokens } from "@mzawadie/views/auth/types/ExternalObtainAccessTokens";
import { TokenAuth_tokenCreate } from "@mzawadie/views/auth/types/TokenAuth";
import { getTokens } from "@mzawadie/views/auth/utils";
import React, { createContext, MutableRefObject, useContext } from "react";
import { useIntl } from "react-intl";

export interface UserContextProps {
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
    user?: User | undefined;
    initializing?: boolean;
    setRedirect?: (redirect: string) => void;
    getRedirect?: () => string | null | undefined;
    clearRedirect?: () => void;
}

export const UserContext = createContext<UserContextProps>({
    login: async () => undefined,
    loginByToken: () => {},
    loginByExternalPlugin: async () => undefined,
    requestLoginByExternalPlugin: async () => undefined,
    logout: () => {},
    tokenAuthLoading: false,
    tokenRefresh: async () => undefined,
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
        hasToken: typeof window !== "undefined" ? !!getTokens() : undefined,
        isAuthenticated: !!context.user,
        tokenAuthLoading: context.tokenAuthLoading,
        tokenVerifyLoading: context.tokenVerifyLoading,
        user: context.user,
    };
};

export default AuthProvider;
