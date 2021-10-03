import { withLoginRedirect } from "@mzawadie/auth";
import { commonMessages } from "@mzawadie/intl";
import type { AppProps } from "next/app";
import { withRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";

const Dashboard = ({ router }: AppProps) => {
    const intl = useIntl();
    const localizedWelcome = intl.formatMessage(commonMessages.welcome);

    return (
        <div className="d-flex justify-content-center">
            <h1>{localizedWelcome}</h1>
            <p>Welcome to your internationalised page!</p>
            <br />
            <p>Current locale: {router.locale}</p>
            <p>Default locale: {router.defaultLocale}</p>
            <p>Configured locales: {JSON.stringify(router.locales, null, 4)}</p>
        </div>
    );
};

// If the user isn't logged in, this will redirect to `/auth/login`.
export default withRouter(withLoginRedirect(Dashboard));
