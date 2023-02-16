// @ts-nocheck
import { WindowTitle } from "@mzawadie/components";
import { sectionNames } from "@mzawadie/core";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps } from "react-router";
import { Route, Switch } from "react-router-dom";

import {
    customerListPath,
    CustomerListUrlQueryParams,
    CustomerListUrlSortField,
    customerPath,
} from "./urls";
import { CustomerDetailsViewComponent } from "./views/CustomerDetails";
import { CustomerListViewComponent } from "./views/CustomerList";

const CustomerListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: CustomerListUrlQueryParams = asSortParams(qs, CustomerListUrlSortField);

    return <CustomerListViewComponent params={params} />;
};

interface CustomerDetailsRouteParams {
    id: string;
}

const CustomerDetailsView: React.FC<RouteComponentProps<CustomerDetailsRouteParams>> = ({
    location,
    match,
}) => {
    const params: CustomerUrlQueryParams = parseQs(location.search.substr(1));

    return <CustomerDetailsViewComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const CustomerPage: React.FC<{}> = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
            <Switch>
                <Route exact path={customerListPath} component={CustomerListView} />
                <Route path={customerPath(":id")} component={CustomerDetailsView} />
            </Switch>
        </>
    );
};

export default CustomerPage;
