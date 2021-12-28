// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { asSortParams } from "@mzawadie/utils/sort";
import { getArrayQueryParam } from "@mzawadie/utils/urls";
import { ProductListUrlQueryParams, ProductListUrlSortField } from "@mzawadie/views/products/urls";
import ProductListComponent from "@mzawadie/views/products/views/ProductList";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const ProductList: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: ProductListUrlQueryParams = asSortParams(
        {
            ...qs,
            categories: getArrayQueryParam(qs.categories),
            collections: getArrayQueryParam(qs.collections),
            ids: getArrayQueryParam(qs.ids),
            productTypes: getArrayQueryParam(qs.productTypes),
        },
        ProductListUrlSortField
    );

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.products)} />
            <ProductListComponent params={params} />
        </>
    );
};

ProductList.layout = AppLayout;
ProductList.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default ProductList;
