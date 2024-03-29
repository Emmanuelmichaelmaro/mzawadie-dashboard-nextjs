// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
    channelAddPath,
    channelPath,
    channelsListPath,
    ChannelsListUrlQueryParams,
    ChannelsListUrlSortField,
} from "./urls";
import { ChannelCreateComponent } from "./views/ChannelCreate";
import { ChannelDetailsComponent } from "./views/ChannelDetails";
import { ChannelsListComponent } from "./views/ChannelsList";

const ChannelDetails: React.FC<RouteComponentProps<any>> = ({ match }) => {
    const params = parseQs(location.search.substr(1));

    return <ChannelDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const ChannelsList: React.FC<RouteComponentProps> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: ChannelsListUrlQueryParams = asSortParams(qs, ChannelsListUrlSortField);
    return <ChannelsListComponent params={params} />;
};

export const ChannelsSection: React.FC<{}> = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.channels)} />

            <Switch>
                <Route exact path={channelsListPath} component={ChannelsList} />
                <Route exact path={channelAddPath} component={ChannelCreateComponent} />
                <Route exact path={channelPath(":id")} component={ChannelDetails} />
            </Switch>
        </>
    );
};

export default ChannelsSection;
