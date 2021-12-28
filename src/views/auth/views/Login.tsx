/* eslint-disable react/prop-types,react-hooks/exhaustive-deps */
// @ts-nocheck
import { useQuery } from "@apollo/client";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useAuth } from "@mzawadie/sdk/lib/src";
import { AvailableExternalAuthentications } from "@mzawadie/views/auth/types/AvailableExternalAuthentications";
import { useRouter } from "next/router";
import React, { useState } from "react";

import LoginPage from "../components/LoginPage";
import { LoginFormData } from "../components/LoginPage/form";
import { availableExternalAuthentications } from "../queries";
import { LoginUrlQueryParams, passwordResetUrl } from "../urls";

interface LoginViewProps {
    params: LoginUrlQueryParams;
}

const LoginView: React.FC<LoginViewProps> = ({ params }) => {
    const navigate = useNavigator();

    const { push, query } = useRouter();

    const [isError, setIsError] = useState(false);

    const [isExternalError, setIsExternalError] = useState(false);

    // const {
    //     isAuthenticated,
    //     login,
    //     loginByExternalPlugin,
    //     requestLoginByExternalPlugin,
    //     tokenAuthLoading,
    // } = useUser();

    const { tokenRefreshing, tokenVerifying, signIn } = useAuth();

    const loading = tokenRefreshing || tokenVerifying;

    const { data: externalAuthentications, loading: externalAuthenticationsLoading } =
        useQuery<AvailableExternalAuthentications>(availableExternalAuthentications);

    const handleSubmit = async (data: LoginFormData) => {
        const result = await signIn(data.email, data.password);

        const errors = result?.dataError || [];

        setIsExternalError(false);

        setIsError(!result || errors?.length > 0);

        if (result && result.data !== [] && result.dataError === undefined) {
            const returnUrl = query.returnUrl || "/";
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            push(returnUrl);
        }

        return errors;
    };

    const handleRequestExternalAuthentication = (pluginId: string) => {};

    // const handleRequestExternalAuthentication = (pluginId: string) =>
    //     requestLoginByExternalPlugin(pluginId, {
    //         redirectUri: urlJoin(
    //             window.location.origin,
    //             APP_MOUNT_URI === APP_DEFAULT_URI ? "" : APP_MOUNT_URI,
    //             loginCallbackPath
    //         ),
    //     });

    // const handleExternalAuthentication = async (code: string, state: string) => {
    //     const result = await loginByExternalPlugin({ code, state });

    //     const errors = result?.errors || [];

    //     setIsError(false);

    //     if (!result || errors?.length > 0) {
    //         setIsExternalError(true);
    //     } else {
    //         navigate(APP_DEFAULT_URI);
    //     }

    //     return errors;
    // };

    // useEffect(() => {
    //     const { code, state } = params;

    //     const isCallbackPath = pathname.includes(loginCallbackPath);

    //     if (code && state && isCallbackPath) {
    //         console.log("Login: Now we handle external authentication...");
    //         // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //         handleExternalAuthentication(code, state);
    //     }
    // }, []);

    return (
        <LoginPage
            error={isError}
            externalError={isExternalError}
            disabled={loading}
            externalAuthentications={externalAuthentications?.shop?.availableExternalAuthentications}
            loading={externalAuthenticationsLoading || loading}
            onExternalAuthentication={handleRequestExternalAuthentication}
            onPasswordRecovery={() => navigate(passwordResetUrl)}
            onSubmit={handleSubmit}
        />
    );
};

LoginView.displayName = "LoginView";

export default LoginView;
