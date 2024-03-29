// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
    staffListPath,
    StaffListUrlQueryParams,
    StaffListUrlSortField,
    staffMemberDetailsPath,
    StaffMemberDetailsUrlQueryParams,
} from "./urls";
import StaffDetailsComponent from "./views/StaffDetails";
import { StaffListComponent } from "./views/StaffList";

const StaffList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: StaffListUrlQueryParams = asSortParams(qs, StaffListUrlSortField);

    return <StaffListComponent params={params} />;
};

interface StaffDetailsRouteProps {
    id: string;
}

const StaffDetails: React.FC<RouteComponentProps<StaffDetailsRouteProps>> = ({ match }) => {
    const params: StaffMemberDetailsUrlQueryParams = parseQs(location.search.substr(1));

    return <StaffDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const Component = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
            <Switch>
                <Route exact path={staffListPath} component={StaffList} />
                <Route path={staffMemberDetailsPath(":id")} component={StaffDetails} />
            </Switch>
        </>
    );
};

export default Component;
