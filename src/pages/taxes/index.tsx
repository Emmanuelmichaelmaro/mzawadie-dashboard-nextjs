import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { countryListPath, countryTaxRatesPath } from "./urls";
import CountryList from "./views/CountryList";
import CountryTaxesComponent, { CountryTaxesParams } from "./views/CountryTaxes";

const CountryTaxes: React.FC<RouteComponentProps<CountryTaxesParams>> = ({ match }) => (
    <CountryTaxesComponent code={match.params.code} />
);

const Component = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.taxes)} />

            <Switch>
                <Route exact path={countryListPath} component={CountryList} />
                <Route exact path={countryTaxRatesPath(":code")} component={CountryTaxes} />
            </Switch>
        </>
    );
};

export default Component;
