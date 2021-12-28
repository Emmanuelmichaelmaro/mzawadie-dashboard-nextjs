// @ts-nocheck
import { Layout } from "@mzawadie/views/auth/components";
import { LoginUrlQueryParams } from "@mzawadie/views/auth/urls";
import { LoginViewComponent } from "@mzawadie/views/auth/views";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";

const LoginView: React.FC = () => {
    const router = useRouter();
    const params: LoginUrlQueryParams =
        // eslint-disable-next-line no-restricted-globals
        typeof window !== "undefined" ? parseQs(location.search.substr(1)) : router.query;

    return <LoginViewComponent params={params} />;
};

LoginView.layout = Layout;

export default LoginView;
