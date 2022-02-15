// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
    pluginListPath,
    PluginListUrlQueryParams,
    PluginListUrlSortField,
    pluginPath,
    PluginUrlQueryParams,
} from "./urls";
import PluginsListComponent from "./views/PluginList";
import PluginsDetailsComponent from "./views/PluginsDetails";

const PluginList: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: PluginListUrlQueryParams = asSortParams(qs, PluginListUrlSortField);

    return <PluginsListComponent params={params} />;
};

const PageDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
    const params: PluginUrlQueryParams = parseQs(location.search.substr(1));

    return <PluginsDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const Component = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.plugins)} />

            <Switch>
                <Route exact path={pluginListPath} component={PluginList} />
                <Route path={pluginPath(":id")} component={PageDetails} />
            </Switch>
        </>
    );
};

export default Component;
