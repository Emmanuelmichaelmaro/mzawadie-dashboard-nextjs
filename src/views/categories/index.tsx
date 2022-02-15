// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch, Route } from "react-router-dom";

import {
    CategoryUrlQueryParams,
    CategoryListUrlQueryParams,
    CategoryListUrlSortField,
    categoryListPath,
    categoryAddPath,
    categoryPath,
} from "./urls";
import CategoryCreateView from "./views/CategoryCreate";
import CategoryDetailsView, { getActiveTab } from "./views/CategoryDetails";
import CategoryListComponent from "./views/CategoryList";

interface CategoryDetailsRouteParams {
    id: string;
}
const CategoryDetails: React.FC<RouteComponentProps<CategoryDetailsRouteParams>> = ({
    location,
    match,
}) => {
    const qs = parseQs(location.search.substr(1));
    const params: CategoryUrlQueryParams = {
        ...qs,
        activeTab: getActiveTab(qs.activeTab),
    };

    return <CategoryDetailsView id={decodeURIComponent(match.params.id)} params={params} />;
};

interface CategoryCreateRouteParams {
    id: string;
}
const CategoryCreate: React.FC<RouteComponentProps<CategoryCreateRouteParams>> = ({ match }) => (
    <CategoryCreateView parentId={match.params.id ? decodeURIComponent(match.params.id) : undefined} />
);

const CategoryList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: CategoryListUrlQueryParams = {
        ...asSortParams(qs, CategoryListUrlSortField),
    };

    return <CategoryListComponent params={params} />;
};

const Component = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.categories)} />
            <Switch>
                <Route exact path={categoryListPath} component={CategoryList} />
                <Route exact path={categoryAddPath()} component={CategoryCreate} />
                <Route exact path={categoryAddPath(":id")} component={CategoryCreate} />
                <Route path={categoryPath(":id")} component={CategoryDetails} />
            </Switch>
        </>
    );
};

export default Component;
