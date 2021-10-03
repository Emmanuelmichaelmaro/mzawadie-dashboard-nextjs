/* eslint-disable react/prop-types,react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import { AvailableExternalAuthentications } from "@mzawadie/auth/types/AvailableExternalAuthentications";
import { APP_DEFAULT_URI, APP_MOUNT_URI } from "@mzawadie/config";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useUser from "@mzawadie/hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import urlJoin from "url-join";

import LoginPage from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/form";
import { availableExternalAuthentications } from "../queries";
import { loginCallbackPath, LoginUrlQueryParams, passwordResetUrl } from "../urls";

interface LoginViewProps {
    params: LoginUrlQueryParams;
}

const LoginView: React.FC<LoginViewProps> = ({ params }) => {
    const navigate = useNavigator();
    const { pathname } = useRouter();
    const [isError, setIsError] = useState(false);
    const [isExternalError, setIsExternalError] = useState(false);

    const { login, requestLoginByExternalPlugin, loginByExternalPlugin, tokenAuthLoading } = useUser();

    const { data: externalAuthentications, loading: externalAuthenticationsLoading } =
        useQuery<AvailableExternalAuthentications>(availableExternalAuthentications);

    const handleSubmit = async (data: LoginFormData) => {
        const result = await login(data.email, data.password);
        const errors = result?.errors || [];

        setIsExternalError(false);
        setIsError(!result || errors?.length > 0);

        return errors;
    };

    const handleRequestExternalAuthentication = (pluginId: string) =>
        requestLoginByExternalPlugin(pluginId, {
            redirectUri: urlJoin(
                window.location.origin,
                APP_MOUNT_URI === APP_DEFAULT_URI ? "" : APP_MOUNT_URI,
                loginCallbackPath
            ),
        });

    const handleExternalAuthentication = async (code: string, state: string) => {
        const result = await loginByExternalPlugin({ code, state });
        const errors = result?.errors || [];

        setIsError(false);

        if (!result || errors?.length > 0) {
            setIsExternalError(true);
        } else {
            navigate(APP_DEFAULT_URI);
        }

        return errors;
    };

    useEffect(() => {
        const { code, state } = params;
        const isCallbackPath = pathname.includes(loginCallbackPath);

        if (code && state && isCallbackPath) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleExternalAuthentication(code, state);
        }
    }, []);

    return (
        <LoginPage
            error={isError}
            externalError={isExternalError}
            disabled={tokenAuthLoading}
            externalAuthentications={externalAuthentications?.shop?.availableExternalAuthentications}
            loading={externalAuthenticationsLoading || tokenAuthLoading}
            onExternalAuthentication={handleRequestExternalAuthentication}
            onPasswordRecovery={() => navigate(passwordResetUrl)}
            onSubmit={handleSubmit}
        />
    );
};

LoginView.displayName = "LoginView";

export default LoginView;
