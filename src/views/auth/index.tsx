// @ts-nocheck
import { parse as parseQs } from "qs";
import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { Layout } from "./components";
import {
    LoginUrlQueryParams,
    newPasswordPath,
    passwordResetPath,
    passwordResetSuccessPath,
} from "./urls";
import { LoginViewComponent } from "./views";
import NewPassword from "./views/NewPassword";
import ResetPassword from "./views/ResetPassword";
import ResetPasswordSuccess from "./views/ResetPasswordSuccess";

const LoginView: React.FC<RouteComponentProps<any>> = () => {
    const params: LoginUrlQueryParams = parseQs(location.search.substr(1));

    return <LoginViewComponent params={params} />;
};

const AuthRouter: React.FC = () => (
    <Layout>
        <Switch>
            <Route path={passwordResetSuccessPath} component={ResetPasswordSuccess} />
            <Route path={passwordResetPath} component={ResetPassword} />
            <Route path={newPasswordPath} component={NewPassword} />
            <Route component={LoginView} />
        </Switch>
    </Layout>
);

AuthRouter.displayName = "AuthRouter";

export default AuthRouter;

export * from "./utils";
