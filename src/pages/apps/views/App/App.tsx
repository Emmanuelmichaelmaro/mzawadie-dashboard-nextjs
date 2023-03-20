// @ts-nocheck
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { useAppQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { appMessages } from "@mzawadie/pages/apps/messages";
import {
    appDetailsUrl,
    appsListPath,
    getAppCompleteUrlFromDashboardUrl,
} from "@mzawadie/pages/apps/urls";
import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { AppPage } from "../../components/AppPage";

interface AppProps {
    id: string;
}

export const App: React.FC<AppProps> = ({ id }) => {
    const location = useLocation();

    const { data } = useAppQuery({
        displayLoader: true,
        variables: { id },
    });

    const appExists = data?.app !== null;

    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    if (!appExists) {
        return <NotFoundPage onBack={() => navigate(appsListPath)} />;
    }

    const appCompleteUrl = getAppCompleteUrlFromDashboardUrl(location.pathname, data?.app?.appUrl, id);

    return (
        <AppPage
            data={data?.app}
            url={appCompleteUrl}
            navigateToAbout={() => navigate(appDetailsUrl(id))}
            onBack={() => navigate(appsListPath)}
            onError={() =>
                notify({
                    status: "error",
                    text: intl.formatMessage(appMessages.failedToFetchAppSettings),
                })
            }
        />
    );
};

export default App;
