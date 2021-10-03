/* eslint-disable
    no-restricted-globals,
    react-hooks/exhaustive-deps,
    @typescript-eslint/ban-ts-comment,
    @typescript-eslint/no-floating-promises,
*/
import NotFound from "@mzawadie/NotFound";
import { Layout } from "@mzawadie/auth/components";
import { LoginUrlQueryParams } from "@mzawadie/auth/urls";
import {
    LoginViewComponent,
    NewPasswordComponent,
    ResetPasswordComponent,
    ResetPasswordSuccessComponent,
} from "@mzawadie/auth/views";
import { AppProps } from "next/app";
import { useRouter, withRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";

const LoginView: React.FC<any> = () => {
    const router = useRouter();
    // @ts-ignore
    const params: LoginUrlQueryParams =
        typeof window !== "undefined" ? parseQs(location.search.substr(1)) : router.asPath;

    return <LoginViewComponent params={params} />;
};

const handleRoutes = (target: string) => {
    switch (target) {
        case "/auth/login":
            return <LoginView />;
        case "/auth/new-password":
            return <NewPasswordComponent />;
        case "/auth/reset-password":
            return <ResetPasswordComponent />;
        case "/auth/reset-password/success":
            return <ResetPasswordSuccessComponent />;
        case "/404":
            return <NotFound />;
        default:
            return <NotFound />;
    }
};

const AuthRoutes = ({ router }: AppProps) => {
    return <Layout>{handleRoutes(router.asPath)}</Layout>;
};

export default withRouter(AuthRoutes);
