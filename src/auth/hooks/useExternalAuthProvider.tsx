/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import { displayDemoMessage, getTokens, removeTokens, setAuthToken, setTokens } from "@mzawadie/auth";
import {
    externalAuthenticationUrlMutation,
    externalObtainAccessTokensMutation,
    externalTokenRefreshMutation,
    externalTokenVerifyMutation,
} from "@mzawadie/auth/mutations";
import {
    ExternalAuthenticationUrl,
    ExternalAuthenticationUrlVariables,
} from "@mzawadie/auth/types/ExternalAuthenticationUrl";
import {
    ExternalObtainAccessTokens,
    ExternalObtainAccessTokens_externalObtainAccessTokens,
    ExternalObtainAccessTokensVariables,
} from "@mzawadie/auth/types/ExternalObtainAccessTokens";
import {
    ExternalRefreshToken,
    ExternalRefreshTokenVariables,
} from "@mzawadie/auth/types/ExternalRefreshToken";
import {
    ExternalVerifyToken,
    ExternalVerifyTokenVariables,
} from "@mzawadie/auth/types/ExternalVerifyToken";
import { DEMO_MODE } from "@mzawadie/config";
import { User } from "@mzawadie/fragments/types/User";
import { SetLocalStorage } from "@mzawadie/hooks/useLocalStorage";
import { commonMessages } from "@mzawadie/intl";
import { getFullName, getMutationStatus } from "@mzawadie/misc";
import errorTracker from "@mzawadie/services/errorTracking";
import { useEffect, useRef, useState } from "react";

import { UseAuthProvider, UseAuthProviderOpts } from "./useAuthProvider";

export interface RequestExternalLoginInput {
    redirectUri: string;
}

export interface ExternalLoginInput {
    code: string;
    state: string;
}

export interface UseExternalAuthProvider extends UseAuthProvider {
    requestLoginByExternalPlugin: (pluginId: string, input: RequestExternalLoginInput) => Promise<void>;
    loginByExternalPlugin: (
        input: ExternalLoginInput
    ) => Promise<ExternalObtainAccessTokens_externalObtainAccessTokens | null | undefined>;
}

export interface UseExternalAuthProviderOpts extends UseAuthProviderOpts {
    setAuthPlugin: SetLocalStorage<any>;
    authPlugin: string;
}

const persistToken = false;

export const useExternalAuthProvider = ({
    apolloClient,
    intl,
    notify,
    authPlugin,
    setAuthPlugin,
}: UseExternalAuthProviderOpts): UseExternalAuthProvider => {
    const [userContext, setUserContext] = useState<undefined | User>(undefined);
    const autoLoginPromise = useRef<Promise<any>>();
    const refreshPromise = useRef<Promise<boolean>>();

    useEffect(() => {
        const token = getTokens().auth;

        if (authPlugin && !!token && !userContext) {
            const input = JSON.stringify({
                token,
            });
            autoLoginPromise.current = tokenVerify({
                variables: { input, pluginId: authPlugin },
            });
        }
    }, []);

    useEffect(() => {
        if (authPlugin && userContext) {
            const { id, email } = userContext;

            errorTracker.setUserData({
                email,
                id,
                username: getFullName(userContext),
            });

            if (!userContext.isStaff) {
                logout();
                notify({
                    status: "error",
                    text: intl.formatMessage(commonMessages.unauthorizedDashboardAccess),
                    title: intl.formatMessage(commonMessages.insufficientPermissions),
                });
            }
        }
    }, [userContext]);

    const logout = () => {
        setUserContext(undefined);
        setAuthPlugin(undefined);
        removeTokens();
    };

    const [externalAuthenticationUrl] = useMutation<
        ExternalAuthenticationUrl,
        ExternalAuthenticationUrlVariables
    >(externalAuthenticationUrlMutation, {
        client: apolloClient,
        onError: logout,
    });

    const [obtainAccessTokens, obtainAccessTokensResult] = useMutation<
        ExternalObtainAccessTokens,
        ExternalObtainAccessTokensVariables
    >(externalObtainAccessTokensMutation, {
        client: apolloClient,
        onCompleted: ({ externalObtainAccessTokens }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (externalObtainAccessTokens?.errors?.length > 0) {
                logout();
            }

            const user = externalObtainAccessTokens?.user;

            if (user && externalObtainAccessTokens?.token && externalObtainAccessTokens?.csrfToken) {
                setUserContext(user);
                setTokens(
                    externalObtainAccessTokens?.token,
                    externalObtainAccessTokens?.csrfToken,
                    persistToken
                );
            }
        },
        onError: logout,
    });

    const [tokenRefresh] = useMutation<ExternalRefreshToken, ExternalRefreshTokenVariables>(
        externalTokenRefreshMutation,
        {
            client: apolloClient,
            onError: logout,
        }
    );

    const [tokenVerify, tokenVerifyResult] = useMutation<
        ExternalVerifyToken,
        ExternalVerifyTokenVariables
    >(externalTokenVerifyMutation, {
        client: apolloClient,
        onCompleted: (result) => {
            if (result.externalVerify === null) {
                logout();
            } else {
                const user = result.externalVerify?.user;

                if (user) {
                    setUserContext(user);
                }
            }
        },
        onError: logout,
    });

    const obtainAccessTokensOpts = {
        ...obtainAccessTokensResult,
        status: getMutationStatus(obtainAccessTokensResult),
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

    const requestLoginByExternalPlugin = async (
        pluginId: string,
        pluginInput: RequestExternalLoginInput
    ) => {
        const input = JSON.stringify(pluginInput);
        const result = await externalAuthenticationUrl({
            variables: {
                input,
                pluginId,
            },
        });

        if (result && !result.data?.externalAuthenticationUrl?.errors.length) {
            setAuthPlugin(pluginId);

            const authenticationData = JSON.parse(
                result.data?.externalAuthenticationUrl?.authenticationData
            );

            // eslint-disable-next-line no-restricted-globals
            location.href = authenticationData.authorizationUrl;
        } else {
            setAuthPlugin(undefined);
        }
    };

    const loginByExternalPlugin = async (loginInput: ExternalLoginInput) => {
        const input = JSON.stringify(loginInput);
        const result = await obtainAccessTokens({
            variables: { input, pluginId: authPlugin },
        });

        if (result && !result.data?.externalObtainAccessTokens?.errors?.length) {
            if (onLogin) {
                onLogin();
            }
        } else {
            setAuthPlugin(undefined);
        }

        return result?.data?.externalObtainAccessTokens;
    };

    const refreshToken = (): Promise<boolean> => {
        if (refreshPromise.current) {
            return refreshPromise.current;
        }

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new Promise((resolve) => {
            const token = getTokens().refresh;
            const input = JSON.stringify({
                refreshToken: token,
            });

            return tokenRefresh({ variables: { input, pluginId: authPlugin } }).then((refreshData) => {
                if (refreshData.data?.externalRefresh?.token) {
                    setAuthToken(refreshData.data?.externalRefresh.token, persistToken);
                    return resolve(true);
                }

                return resolve(false);
            });
        });
    };

    return {
        autoLoginPromise,
        loginByExternalPlugin,
        logout,
        requestLoginByExternalPlugin,
        tokenAuthLoading: obtainAccessTokensOpts.loading,
        tokenRefresh: refreshToken,
        tokenVerifyLoading: tokenVerifyOpts.loading,
        user: userContext,
    };
};
