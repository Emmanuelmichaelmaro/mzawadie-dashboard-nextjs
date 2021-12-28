/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import { DEMO_MODE, commonMessages, getFullName, getMutationStatus } from "@mzawadie/core";
import { User } from "@mzawadie/fragments/types/User";
import useLocalStorage, { SetLocalStorage } from "@mzawadie/hooks/useLocalStorage";
import errorTracker from "@mzawadie/services/errorTracking";
import {
    isSupported as isCredentialsManagementAPISupported,
    login as loginWithCredentialsManagementAPI,
    saveCredentials,
} from "@mzawadie/utils/credentialsManagement";
import {
    tokenAuthMutation,
    tokenRefreshMutation,
    tokenVerifyMutation,
} from "@mzawadie/views/auth/mutations";
import { RefreshToken, RefreshTokenVariables } from "@mzawadie/views/auth/types/RefreshToken";
import {
    TokenAuth,
    TokenAuth_tokenCreate,
    TokenAuthVariables,
} from "@mzawadie/views/auth/types/TokenAuth";
import { VerifyToken, VerifyTokenVariables } from "@mzawadie/views/auth/types/VerifyToken";
import {
    displayDemoMessage,
    getTokens,
    removeTokens,
    removeUserData,
    setAuthToken,
    setTokens,
} from "@mzawadie/views/auth/utils";
import { useEffect, useRef, useState } from "react";

import { UseAuthProvider, UseAuthProviderOpts } from "./useAuthProvider";

export interface UseMzawadieAuthProvider extends UseAuthProvider {
    login: (username: string, password: string) => Promise<TokenAuth_tokenCreate | null | undefined>;
    loginByToken: (auth: string, csrf: string, user: User) => void;
}

export interface UseMzawadieAuthProviderOpts extends UseAuthProviderOpts {
    setAuthPlugin: SetLocalStorage<any>;
    authPlugin: string | undefined;
}

const persistToken = true;

export const useMzawadieAuthProvider = ({
    apolloClient,
    intl,
    notify,
    authPlugin,
    setAuthPlugin,
}: UseMzawadieAuthProviderOpts): UseMzawadieAuthProvider => {
    const [userContext, setUserContext] = useLocalStorage<undefined | User>("user", undefined);
    const [initializing, setInitializing] = useState(true);
    const autoLoginPromise = useRef<Promise<any>>();
    const refreshPromise = useRef<Promise<boolean>>();

    useEffect(() => {
        const token = getTokens().auth;

        if (!authPlugin && !!token && !userContext) {
            autoLoginPromise.current = tokenVerify({ variables: { token } });
        } else if (!authPlugin) {
            autoLoginPromise.current = loginWithCredentialsManagementAPI(login);
        } else if (!authPlugin && !!token) {
            console.log(
                "No AuthPlugin detected, but there is preserved token. I am Mzawadie Provider!"
            );
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            tokenVerify({ variables: { token } });
        }
    }, []);

    useEffect(() => {
        if (!authPlugin && userContext) {
            const { id, email } = userContext;

            console.log(
                "No AuthPlugin detected, but user context is available. I am Mzawadie Provider!"
            );

            errorTracker.setUserData({
                email,
                id,
                username: getFullName(userContext),
            });

            if (!userContext.isStaff) {
                // logout();
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
        removeUserData();
    };

    const [tokenAuth, tokenAuthResult] = useMutation<TokenAuth, TokenAuthVariables>(tokenAuthMutation, {
        client: apolloClient,
        onCompleted: async ({ tokenCreate }) => {
            const errors = tokenCreate?.errors;

            // @ts-ignore
            if (errors !== null && errors?.length > 0) {
                await logout();
            }

            const user = tokenCreate?.user;

            if (user && tokenCreate?.token && tokenCreate?.csrfToken) {
                setUserContext(user);
                setTokens(tokenCreate?.token, tokenCreate?.csrfToken, persistToken);
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

        setInitializing(false);

        return result.data?.tokenCreate;
    };

    const loginByToken = (auth: string, refresh: string, user: User) => {
        setAuthPlugin(undefined);
        setUserContext(user);
        setTokens(auth, refresh, persistToken);
        setInitializing(false);
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
        initializing,
    };
};
