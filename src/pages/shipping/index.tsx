import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import {
    shippingPriceRatesEditPath,
    shippingPriceRatesPath,
    ShippingRateCreateUrlQueryParams,
    ShippingRateUrlQueryParams,
    shippingWeightRatesEditPath,
    shippingWeightRatesPath,
    shippingZoneAddPath,
    shippingZonePath,
    shippingZonesListPath,
    ShippingZonesListUrlQueryParams,
    ShippingZoneUrlQueryParams,
} from "./urls";
import { PriceRatesCreateComponent } from "./views/PriceRatesCreate";
import { PriceRatesUpdateComponent } from "./views/PriceRatesUpdate";
import ShippingZoneCreate from "./views/ShippingZoneCreate";
import ShippingZoneDetailsComponent from "./views/ShippingZoneDetails";
import ShippingZonesListComponent from "./views/ShippingZonesList";
import { WeightRatesCreateComponent } from "./views/WeightRatesCreate";
import { WeightRatesUpdateComponent } from "./views/WeightRatesUpdate";

const ShippingZonesList: React.FC<RouteComponentProps<{}>> = ({ location }) => {
    const params: ShippingZonesListUrlQueryParams = parseQs(location.search.substr(1));
    return <ShippingZonesListComponent params={params} />;
};

interface ShippingZoneDetailsRouteProps {
    id: string;
}
const ShippingZoneDetails: React.FC<RouteComponentProps<ShippingZoneDetailsRouteProps>> = ({
    location,
    match,
}) => {
    const params: ShippingZoneUrlQueryParams = parseQs(location.search.substr(1));
    return <ShippingZoneDetailsComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const PriceRatesCreate: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
    const params: ShippingRateCreateUrlQueryParams = parseQs(location.search.substr(1));

    return <PriceRatesCreateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const WeightRatesCreate: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
    const params: ShippingRateCreateUrlQueryParams = parseQs(location.search.substr(1));

    return <WeightRatesCreateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const WeightRatesUpdate: React.FC<
    RouteComponentProps<{
        id: string;
        rateId: string;
    }>
> = ({ match }) => {
    const params: ShippingRateUrlQueryParams = parseQs(location.search.substr(1));

    return (
        <WeightRatesUpdateComponent
            id={decodeURIComponent(match.params.id)}
            rateId={decodeURIComponent(match.params.rateId)}
            params={params}
        />
    );
};

const PriceRatesUpdate: React.FC<
    RouteComponentProps<{
        id: string;
        rateId: string;
    }>
> = ({ match }) => {
    const params: ShippingRateUrlQueryParams = parseQs(location.search.substr(1));

    return (
        <PriceRatesUpdateComponent
            id={decodeURIComponent(match.params.id)}
            rateId={decodeURIComponent(match.params.rateId)}
            params={params}
        />
    );
};

export const ShippingRouter: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
            <Switch>
                <Route exact path={shippingZonesListPath} component={ShippingZonesList} />
                <Route exact path={shippingZoneAddPath} component={ShippingZoneCreate} />
                <Route exact path={shippingZonePath(":id")} component={ShippingZoneDetails} />
                <Route path={shippingPriceRatesPath(":id")} component={PriceRatesCreate} />
                <Route path={shippingWeightRatesPath(":id")} component={WeightRatesCreate} />
                <Route
                    path={shippingWeightRatesEditPath(":id", ":rateId")}
                    component={WeightRatesUpdate}
                />
                <Route
                    path={shippingPriceRatesEditPath(":id", ":rateId")}
                    component={PriceRatesUpdate}
                />
            </Switch>
        </>
    );
};

export default ShippingRouter;
