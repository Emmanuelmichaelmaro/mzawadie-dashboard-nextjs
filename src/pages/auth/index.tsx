// @ts-nocheck
import {
    LoginViewComponent,
    NewPasswordComponent,
    ResetPasswordComponent,
    ResetPasswordSuccessComponent,
} from "@mzawadie/pages/auth/views";
import { parse as parseQs } from "qs";
import React, { useContext } from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import Layout from "./components/Layout";
import { UserContext as Context } from "./types";
import {
    LoginUrlQueryParams,
    newPasswordPath,
    passwordResetPath,
    passwordResetSuccessPath,
} from "./urls";

const LoginView: React.FC<RouteComponentProps<any>> = () => {
    const params: LoginUrlQueryParams = parseQs(location.search.substr(1));
    return <LoginViewComponent params={params} />;
};

export const UserContext = React.createContext<Context>({
    login: undefined,
    loginByExternalPlugin: undefined,
    logout: undefined,
    requestLoginByExternalPlugin: undefined,
    authenticating: false,
    authenticated: false,
});

const AuthRouter: React.FC = () => (
    <Layout>
        <Switch>
            <Route path={passwordResetSuccessPath} component={ResetPasswordSuccessComponent} />
            <Route path={passwordResetPath} component={ResetPasswordComponent} />
            <Route path={newPasswordPath} component={NewPasswordComponent} />
            <Route component={LoginView} />
        </Switch>
    </Layout>
);

AuthRouter.displayName = "AuthRouter";

export default AuthRouter;

export { default as AuthProvider } from "./AuthProvider";

export * from "./utils";

export * from "./errors";

export const useUser = () => useContext(UserContext);
