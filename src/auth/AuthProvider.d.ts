import { ExternalLoginInput, RequestExternalLoginInput } from "@mzawadie/auth/hooks/useExternalAuthProvider";
import { ExternalObtainAccessTokens_externalObtainAccessTokens } from "@mzawadie/auth/types/ExternalObtainAccessTokens";
import { TokenAuth_tokenCreate } from "@mzawadie/auth/types/TokenAuth";
import { User } from "@mzawadie/fragments/types/User";
import React, { MutableRefObject } from "react";
interface UserContextProps {
    autoLoginPromise?: MutableRefObject<Promise<any> | undefined>;
    login: (username: string, password: string) => Promise<TokenAuth_tokenCreate | null | undefined>;
    loginByToken: (auth: string, csrf: string, user: User) => void;
    loginByExternalPlugin: (input: ExternalLoginInput) => Promise<ExternalObtainAccessTokens_externalObtainAccessTokens | null | undefined>;
    requestLoginByExternalPlugin: (pluginId: string, input: RequestExternalLoginInput) => Promise<void>;
    logout: () => void;
    tokenAuthLoading: boolean;
    tokenRefresh: () => Promise<boolean | undefined>;
    tokenVerifyLoading: boolean;
    user?: User;
}
export declare const UserContext: React.Context<UserContextProps>;
interface AuthProviderProps {
    children: React.ReactNode;
}
declare const AuthProvider: React.FC<AuthProviderProps>;
export declare const useAuth: () => {
    hasToken: boolean;
    isLoggedIn: boolean;
    tokenAuthLoading: boolean;
    tokenVerifyLoading: boolean;
    user: User | undefined;
};
export default AuthProvider;
