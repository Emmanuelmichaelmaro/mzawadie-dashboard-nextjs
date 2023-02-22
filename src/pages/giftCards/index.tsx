// @ts-nocheck
import { WindowTitle } from "@mzawadie/components";
import { sectionNames } from "@mzawadie/core";
import { GiftCardSettingsPage as GiftCardSettings } from "@mzawadie/pages/giftCards/components/GiftCardSettings";
import { GiftCardUpdate as GiftCardUpdateComponent } from "@mzawadie/pages/giftCards/components/GiftCardUpdate";
import { GiftCardUpdatePageUrlQueryParams } from "@mzawadie/pages/giftCards/components/GiftCardUpdate/types";
import { GiftCardsList as GiftCardListComponent } from "@mzawadie/pages/giftCards/components/GiftCardsList";
import {
    GiftCardListUrlQueryParams,
    GiftCardUrlSortField,
} from "@mzawadie/pages/giftCards/components/GiftCardsList/types";
import { giftCardPath, giftCardSettingsUrl, giftCardsListPath } from "@mzawadie/pages/giftCards/urls";
import { asSortParams } from "@mzawadie/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

const GiftCardUpdatePage: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
    const params: GiftCardUpdatePageUrlQueryParams = parseQs(location.search.substr(1));
    return <GiftCardUpdateComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const GiftCardList: React.FC<RouteComponentProps<any>> = () => {
    const qs = parseQs(location.search.substr(1));
    const params: GiftCardListUrlQueryParams = asSortParams(
        qs,
        GiftCardUrlSortField,
        GiftCardUrlSortField.usedBy
    );

    return <GiftCardListComponent params={params} />;
};

const Component: React.FC = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.giftCards)} />
            <Switch>
                <Route path={giftCardSettingsUrl} component={GiftCardSettings} />
                <Route exact path={giftCardsListPath} component={GiftCardList} />
                <Route path={giftCardPath(":id")} component={GiftCardUpdatePage} />
            </Switch>
        </>
    );
};

export default Component;
