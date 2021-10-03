/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import { displayDemoMessage, getTokens, removeTokens, setAuthToken, setTokens } from "@mzawadie/auth";
import { tokenAuthMutation, tokenRefreshMutation, tokenVerifyMutation } from "@mzawadie/auth/mutations";
import { RefreshToken, RefreshTokenVariables } from "@mzawadie/auth/types/RefreshToken";
import { TokenAuth, TokenAuth_tokenCreate, TokenAuthVariables } from "@mzawadie/auth/types/TokenAuth";
import { VerifyToken, VerifyTokenVariables } from "@mzawadie/auth/types/VerifyToken";
import { DEMO_MODE } from "@mzawadie/config";
import { User } from "@mzawadie/fragments/types/User";
import { SetLocalStorage } from "@mzawadie/hooks/useLocalStorage";
import { commonMessages } from "@mzawadie/intl";
import { getFullName, getMutationStatus } from "@mzawadie/misc";
import errorTracker from "@mzawadie/services/errorTracking";
import {
    isSupported as isCredentialsManagementAPISupported,
    login as loginWithCredentialsManagementAPI,
    saveCredentials,
} from "@mzawadie/utils/credentialsManagement";
import { useEffect, useRef, useState } from "react";

import { isLoggedInVar } from "../lib/apollo";
import { UseAuthProvider, UseAuthProviderOpts } from "./useAuthProvider";

export interface UseMzawadieAuthProvider extends UseAuthProvider {
    login: (username: string, password: string) => Promise<TokenAuth_tokenCreate | null | undefined>;
    loginByToken: (auth: string, csrf: string, user: User) => void;
}

export interface UseMzawadieAuthProviderOpts extends UseAuthProviderOpts {
    setAuthPlugin: SetLocalStorage<any>;
    authPlugin: string;
}

const persistToken = false;

export const useMzawadieAuthProvider = ({
    apolloClient,
    intl,
    notify,
    authPlugin,
    setAuthPlugin,
}: UseMzawadieAuthProviderOpts): UseMzawadieAuthProvider => {
    const [userContext, setUserContext] = useState<undefined | User>(undefined);
    const autoLoginPromise = useRef<Promise<any>>();
    const refreshPromise = useRef<Promise<boolean>>();

    useEffect(() => {
        const token = getTokens().auth;

        if (!authPlugin && !!token && !userContext) {
            autoLoginPromise.current = tokenVerify({ variables: { token } });
        } else if (!authPlugin) {
            autoLoginPromise.current = loginWithCredentialsManagementAPI(login);
        }
    }, []);

    useEffect(() => {
        if (!authPlugin && userContext) {
            const { id, email } = userContext;

            errorTracker.setUserData({
                email,
                id,
                username: getFullName(userContext),
            });

            if (!userContext.isStaff) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                logout();
                notify({
                    status: "error",
                    text: intl.formatMessage(commonMessages.unauthorizedDashboardAccess),
                    title: intl.formatMessage(commonMessages.insufficientPermissions),
                });
            }
        }
    }, [userContext]);

    const logout = async () => {
        setUserContext(undefined);
        if (isCredentialsManagementAPISupported) {
            await navigator.credentials.preventSilentAccess();
        }
        removeTokens();
    };

    const [tokenAuth, tokenAuthResult] = useMutation<TokenAuth, TokenAuthVariables>(tokenAuthMutation, {
        client: apolloClient,
        onCompleted: async ({ tokenCreate }) => {
            const errors = tokenCreate?.errors;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (errors !== null && errors?.length > 0) {
                await logout();
            }

            const user = tokenCreate?.user;

            if (user && tokenCreate?.token && tokenCreate?.csrfToken) {
                setUserContext(user);
                setTokens(tokenCreate?.token, tokenCreate?.csrfToken, persistToken);
                isLoggedInVar(true);
            }
        },
        onError: logout,
    });

    const [tokenRefresh] = useMutation<RefreshToken, RefreshTokenVariables>(tokenRefreshMutation, {
        client: apolloClient,
        onError: logout,
    });

    const [tokenVerify, tokenVerifyResult] = useMutation<VerifyToken, VerifyTokenVariables>(
        tokenVerifyMutation,
        {
            client: apolloClient,
            onCompleted: async (result) => {
                if (result.tokenVerify === null) {
                    await logout();
                } else {
                    const user = result.tokenVerify?.user;

                    if (user) {
                        setUserContext(user);
                    }
                }
            },
            onError: logout,
        }
    );

    const tokenAuthOpts = {
        ...tokenAuthResult,
        status: getMutationStatus(tokenAuthResult),
    };

    const tokenVerifyOpts = {
        ...tokenVerifyResult,
        status: getMutationStatus(tokenVerifyResult),
    };

    const onLogin = () => {
        if (DEMO_MODE) {
            displayDemoMessage(intl, notify);
        }
    };

    const login = async (email: string, password: string) => {
        setAuthPlugin(undefined);

        const result = await tokenAuth({ variables: { email, password } });

        if (result && !result.data?.tokenCreate?.errors.length) {
            if (onLogin) {
                onLogin();
            }

            if (result.data?.tokenCreate?.user) {
                await saveCredentials(result.data?.tokenCreate?.user, password);
            }
        }

        return result.data?.tokenCreate;
    };

    const loginByToken = (auth: string, refresh: string, user: User) => {
        setAuthPlugin(undefined);
        setUserContext(user);
        setTokens(auth, refresh, persistToken);
    };

    const refreshToken = (): Promise<boolean> => {
        if (refreshPromise.current) {
            return refreshPromise.current;
        }

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new Promise((resolve) => {
            const token = getTokens().refresh;

            if (token !== null && !!token) {
                return tokenRefresh({ variables: { token } }).then((refreshData) => {
                    if (refreshData.data?.tokenRefresh?.token) {
                        setAuthToken(refreshData.data.tokenRefresh.token, persistToken);
                        return resolve(true);
                    }

                    return resolve(false);
                });
            }

            return false;
        });
    };

    return {
        autoLoginPromise,
        login,
        loginByToken,
        logout,
        tokenAuthLoading: tokenAuthOpts.loading,
        tokenRefresh: refreshToken,
        tokenVerifyLoading: tokenVerifyOpts.loading,
        user: userContext,
    };
};
