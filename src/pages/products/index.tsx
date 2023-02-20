// @ts-nocheck
import { WindowTitle } from "@mzawadie/components";
import { sectionNames } from "@mzawadie/core";
import {
    productListPath,
    ProductListUrlQueryParams,
    ProductListUrlSortField,
} from "@mzawadie/pages/products/urls";
import { asSortParams } from "@mzawadie/utils/sort";
import { getArrayQueryParam } from "@mzawadie/utils/urls";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { ProductListComponent } from "./views/ProductList";

const ProductList: React.FC<RouteComponentProps<any>> = ({ location }) => {
    const qs = parseQs(location.search.substr(1));
    const params: ProductListUrlQueryParams = asSortParams(
        {
            ...qs,
            categories: getArrayQueryParam(qs.categories),
            collections: getArrayQueryParam(qs.collections),
            ids: getArrayQueryParam(qs.ids),
            productTypes: getArrayQueryParam(qs.productTypes),
            productKind: qs.productKind,
        },
        ProductListUrlSortField
    );

    return <ProductListComponent params={params} />;
};

const Component = () => {
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.products)} />
            <Switch>
                <Route exact path={productListPath} component={ProductList} />
            </Switch>
        </>
    );
};

export default Component;
