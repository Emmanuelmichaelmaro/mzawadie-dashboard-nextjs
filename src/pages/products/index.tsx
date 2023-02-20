// @ts-nocheck
import { WindowTitle } from "@mzawadie/components";
import { sectionNames } from "@mzawadie/core";
import {
    productAddPath,
    ProductCreateUrlQueryParams,
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

import { ProductCreateComponent } from "./views/ProductCreate";
import { ProductListComponent } from "./views/ProductList";

const ProductCreate: React.FC<RouteComponentProps<any>> = () => {
    const params: ProductCreateUrlQueryParams = parseQs(location.search.substr(1));
    return <ProductCreateComponent params={params} />;
};

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
                <Route exact path={productAddPath} component={ProductCreate} />
            </Switch>
        </>
    );
};

export default Component;
