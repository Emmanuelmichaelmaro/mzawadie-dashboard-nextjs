// @ts-nocheck
import { ApolloClient } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/Messages";
import { APP_DEFAULT_URI, APP_MOUNT_URI, DEMO_MODE, commonMessages } from "@mzawadie/core";
import { useUserDetailsQuery } from "@mzawadie/graphql";
import { useLocalStorage, useNavigator } from "@mzawadie/hooks";
import {
    isSupported as isCredentialsManagementAPISupported,
    login as loginWithCredentialsManagementAPI,
    saveCredentials,
} from "@mzawadie/utils/credentialsManagement";
import { GetExternalAccessTokenData, LoginData, useAuth, useAuthState } from "@saleor/sdk";
import { useEffect, useRef, useState } from "react";
import { IntlShape } from "react-intl";
import urlJoin from "url-join";

import {
    ExternalLoginInput,
    RequestExternalLoginInput,
    RequestExternalLogoutInput,
    UserContext,
    UserContextError,
} from "../types";
import { displayDemoMessage } from "../utils";

export interface UseAuthProviderOpts {
    intl: IntlShape;
    notify: IMessageContext;
    apolloClient: ApolloClient<any>;
}

export function useAuthProvider({ intl, notify, apolloClient }: UseAuthProviderOpts): UserContext {
    const { login, getExternalAuthUrl, getExternalAccessToken, logout } = useAuth();
    const navigate = useNavigator();
    const { authenticated, authenticating, user } = useAuthState();
    const [requestedExternalPluginId] = useLocalStorage("requestedExternalPluginId", null);
    const [error, setError] = useState<UserContextError>();
    const permitCredentialsAPI = useRef(true);

    useEffect(() => {
        if (authenticating && error) {
            setError(undefined);
        }
    }, [authenticating]);

    useEffect(() => {
        if (authenticated) {
            permitCredentialsAPI.current = true;
        }
    }, [authenticated]);

    useEffect(() => {
        if (
            !authenticated &&
            !authenticating &&
            !requestedExternalPluginId &&
            permitCredentialsAPI.current
        ) {
            permitCredentialsAPI.current = false;
            // eslint-disable-next-line no-console
            loginWithCredentialsManagementAPI(handleLogin).then((r) => console.log(r));
        }
    }, [authenticated, authenticating]);

    const userDetails = useUserDetailsQuery({
        client: apolloClient,
        skip: !authenticated,
        // Don't change this to 'network-only' - update of intl provider's
        // state will cause an error
        fetchPolicy: "cache-and-network",
    });

    const handleLogout = async () => {
        const path = APP_MOUNT_URI === APP_DEFAULT_URI ? "" : APP_MOUNT_URI;
        const returnTo = urlJoin(window.location.origin, path);

        const result = await logout({
            input: JSON.stringify({
                returnTo,
            } as RequestExternalLogoutInput),
        });

        if (isCredentialsManagementAPISupported) {
            await navigator.credentials.preventSilentAccess();
        }

        // Forget last logged-in user data.
        // On next login, user details query will be re-fetched due to cache-and-network fetch policy.
        await apolloClient.clearStore();

        const errors = result?.errors || [];

        const externalLogoutUrl = result
            ? JSON.parse(result.data?.externalLogout?.logoutData || null)?.logoutUrl
            : "";

        if (!errors.length) {
            if (externalLogoutUrl) {
                window.location.href = externalLogoutUrl;
            } else {
                navigate("/");
            }
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const result = await login({
                email,
                password,
            });

            if (result && !result.data?.tokenCreate?.errors.length) {
                if (DEMO_MODE) {
                    displayDemoMessage(intl, notify);
                }
                await saveCredentials(result.data?.tokenCreate?.user, password);
            } else {
                setError("loginError");
            }

            await logoutNonStaffUser(result.data?.tokenCreate);

            return result.data?.tokenCreate;
        } catch (error) {
            setError("serverError");
        }
    };

    const handleRequestExternalLogin = async (pluginId: string, input: RequestExternalLoginInput) => {
        const result = await getExternalAuthUrl({
            pluginId,
            input: JSON.stringify(input),
        });

        return result?.data?.externalAuthenticationUrl;
    };

    const handleExternalLogin = async (pluginId: string, input: ExternalLoginInput) => {
        try {
            const result = await getExternalAccessToken({
                pluginId,
                input: JSON.stringify(input),
            });

            if (result && !result.data?.externalObtainAccessTokens?.errors.length) {
                if (DEMO_MODE) {
                    displayDemoMessage(intl, notify);
                }
            } else {
                setError("externalLoginError");
            }

            await logoutNonStaffUser(result.data?.externalObtainAccessTokens);

            return result?.data?.externalObtainAccessTokens;
        } catch (error) {
            setError("serverError");
        }
    };

    const logoutNonStaffUser = async (data: LoginData | GetExternalAccessTokenData) => {
        if (data.user && !data.user.isStaff) {
            notify({
                status: "error",
                text: intl.formatMessage(commonMessages.unauthorizedDashboardAccess),
                title: intl.formatMessage(commonMessages.insufficientPermissions),
            });
            await handleLogout();
        }
    };

    return {
        login: handleLogin,
        requestLoginByExternalPlugin: handleRequestExternalLogin,
        loginByExternalPlugin: handleExternalLogin,
        logout: handleLogout,
        authenticating: authenticating && !error,
        authenticated: authenticated && user?.isStaff,
        user: userDetails.data?.me,
        error,
    };
}
