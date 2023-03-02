// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import WebhooksRoutes from "@mzawadie/pages/webhooks";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
    appDetailsPath,
    AppDetailsUrlQueryParams,
    appInstallPath,
    AppInstallUrlQueryParams,
    AppListUrlQueryParams,
    appPath,
    appSettingsPath,
    appsListPath,
    customAppAddPath,
    customAppPath,
    CustomAppUrlQueryParams,
} from "./urls";
import { AppView } from "./views/App";
import { AppDetailsView } from "./views/AppDetails";
import { AppInstallView } from "./views/AppInstall";
import { AppSettingsView } from "./views/AppSettings";
import { AppsListView } from "./views/AppsList";
import { CustomAppCreateView } from "./views/CustomAppCreate";
import { CustomAppDetailsView } from "./views/CustomAppDetails";

const AppDetails: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
    const params: AppDetailsUrlQueryParams = parseQs(location.search.substr(1));
    return <AppDetailsView id={decodeURIComponent(match.params.id)} params={params} />;
};

const AppSettings: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => (
    <AppSettingsView id={decodeURIComponent(match.params.id)} />
);

const App: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => (
    <AppView id={decodeURIComponent(match.params.id)} />
);

const AppInstall: React.FC<RouteComponentProps> = (props) => {
    const params: AppInstallUrlQueryParams = parseQs(location.search.substr(1));
    return <AppInstallView params={params} {...props} />;
};

interface CustomAppDetailsProps extends RouteComponentProps<{ id?: string }> {
    token: string;
    onTokenClose: () => void;
}

const CustomAppDetails: React.FC<CustomAppDetailsProps> = ({ match, token, onTokenClose }) => {
    const params: CustomAppUrlQueryParams = parseQs(location.search.substr(1));
    const { id } = match.params;

    if (!id) {
        throw new Error("No ID provided");
    }

    return (
        <CustomAppDetailsView
            id={decodeURIComponent(match.params.id)}
            params={params}
            token={token}
            onTokenClose={onTokenClose}
        />
    );
};

const AppsList: React.FC<RouteComponentProps> = () => {
    const params: AppListUrlQueryParams = parseQs(location.search.substr(1));
    return <AppsListView params={params} />;
};

const Component = () => {
    const intl = useIntl();
    const [token, setToken] = React.useState<string>(null);

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.apps)} />

            <Switch>
                <Route exact path={appsListPath} component={AppsList} />
                <Route
                    exact
                    path={customAppAddPath}
                    render={() => <CustomAppCreateView setToken={setToken} />}
                />
                <Route exact path={appInstallPath} component={AppInstall} />
                <Route exact path={appDetailsPath(":id")} component={AppDetails} />
                <Route exact path={appSettingsPath(":id")} component={AppSettings} />
                <Route path={appPath(":id")} component={App} />
                <Route
                    exact
                    path={customAppPath(":id")}
                    render={(props) => (
                        <CustomAppDetails
                            {...props}
                            token={token}
                            onTokenClose={() => setToken(null)}
                        />
                    )}
                />

                <WebhooksRoutes />
            </Switch>
        </>
    );
};

export default Component;
