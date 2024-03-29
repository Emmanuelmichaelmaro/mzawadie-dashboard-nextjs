// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
    pageTypeAddPath,
    pageTypeListPath,
    PageTypeListUrlQueryParams,
    PageTypeListUrlSortField,
    pageTypePath,
    PageTypeUrlQueryParams,
} from "./urls";
import PageTypeCreate from "./views/PageTypeCreate";
import PageTypeDetailsComponent from "./views/PageTypeDetails";
import { PageTypeListComponent } from "./views/PageTypeList";

const PageTypeList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: PageTypeListUrlQueryParams = asSortParams(qs, PageTypeListUrlSortField);
    return <PageTypeListComponent params={params} />;
};

interface PageTypeDetailsRouteParams {
    id: string;
}

const PageTypeDetails: React.FC<RouteComponentProps<PageTypeDetailsRouteParams>> = ({ match }) => {
    const params: PageTypeUrlQueryParams = parseQs(location.search.substr(1));

    return <PageTypeDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

export const PageTypeRouter: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.pageTypes)} />

            <Switch>
                <Route exact path={pageTypeListPath} component={PageTypeList} />
                <Route exact path={pageTypeAddPath} component={PageTypeCreate} />
                <Route path={pageTypePath(":id")} component={PageTypeDetails} />
            </Switch>
        </>
    );
};

PageTypeRouter.displayName = "PageTypeRouter";

export default PageTypeRouter;
