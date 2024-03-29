// @ts-nocheck
import { useAvailableExternalAuthenticationsQuery } from "@mzawadie/graphql";
import { useLocalStorage, useNavigator } from "@mzawadie/hooks";
import { getAppMountUriForRedirect } from "@mzawadie/utils/urls";
import React, { useEffect } from "react";
import urlJoin from "url-join";
import useRouter from "use-react-router";

import { useUser } from "..";
import { LoginPage } from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/types";
import { loginCallbackPath, LoginUrlQueryParams, passwordResetUrl } from "../urls";

interface LoginViewProps {
    params: LoginUrlQueryParams;
}

const LoginView: React.FC<LoginViewProps> = ({ params }) => {
    const navigate = useNavigator();
    const { location } = useRouter();

    const { login, requestLoginByExternalPlugin, loginByExternalPlugin, authenticating, error } =
        useUser();

    const { data: externalAuthentications, loading: externalAuthenticationsLoading } =
        useAvailableExternalAuthenticationsQuery();

    const [requestedExternalPluginId, setRequestedExternalPluginId] = useLocalStorage(
        "requestedExternalPluginId",
        null
    );

    const [fallbackUri, setFallbackUri] = useLocalStorage("externalLoginFallbackUri", null);

    const handleSubmit = async (data: LoginFormData) => {
        const result = await login(data.email, data.password);
        return result?.errors || [];
    };

    const handleRequestExternalAuthentication = async (pluginId: string) => {
        setFallbackUri(location.pathname);

        const result = await requestLoginByExternalPlugin(pluginId, {
            redirectUri: urlJoin(
                window.location.origin,
                getAppMountUriForRedirect(),
                loginCallbackPath
            ),
        });

        const data = JSON.parse(result?.authenticationData || "");

        if (data && !result?.errors?.length) {
            setRequestedExternalPluginId(pluginId);
            window.location.href = data.authorizationUrl;
        }
    };

    const handleExternalAuthentication = async (code: string, state: string) => {
        const result = await loginByExternalPlugin(requestedExternalPluginId, {
            code,
            state,
        });

        setRequestedExternalPluginId(null);

        if (result && !result?.errors?.length) {
            navigate(fallbackUri ?? "/");
            setFallbackUri(null);
        }
    };

    useEffect(() => {
        const { code, state } = params;
        const isCallbackPath = location.pathname.includes(loginCallbackPath);

        if (code && state && isCallbackPath) {
            handleExternalAuthentication(code, state);
        }
    }, []);

    return (
        <LoginPage
            error={error}
            disabled={authenticating}
            loading={externalAuthenticationsLoading || authenticating}
            externalAuthentications={externalAuthentications?.shop?.availableExternalAuthentications}
            onExternalAuthentication={handleRequestExternalAuthentication}
            onPasswordRecovery={() => navigate(passwordResetUrl)}
            onSubmit={handleSubmit}
        />
    );
};

LoginView.displayName = "LoginView";

export default LoginView;
