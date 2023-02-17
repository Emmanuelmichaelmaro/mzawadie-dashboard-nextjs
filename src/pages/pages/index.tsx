// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
    pageCreatePath,
    pageListPath,
    PageListUrlQueryParams,
    PageListUrlSortField,
    pagePath,
    PageUrlQueryParams,
} from "./urls";
import PageCreateComponent from "./views/PageCreate";
import PageDetailsComponent from "./views/PageDetails";
import { PageListComponent } from "./views/PageList";

const PageList: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: PageListUrlQueryParams = asSortParams(
        qs,
        PageListUrlSortField,
        PageListUrlSortField.title
    );
    return <PageListComponent params={params} />;
};

const PageCreate: React.FC<RouteComponentProps<any>> = ({ match }) => {
    const params: PageUrlQueryParams = parseQs(location.search.substr(1));

    return <PageCreateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const PageDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
    const params: PageUrlQueryParams = parseQs(location.search.substr(1));

    return <PageDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const Component = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.pages)} />

            <Switch>
                <Route exact path={pageListPath} component={PageList} />
                <Route exact path={pageCreatePath} component={PageCreate} />
                <Route path={pagePath(":id")} component={PageDetails} />
            </Switch>
        </>
    );
};

export default Component;
