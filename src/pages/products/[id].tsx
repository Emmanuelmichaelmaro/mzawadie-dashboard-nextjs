// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { getArrayQueryParam } from "@mzawadie/utils/urls";
import { ProductUrlQueryParams } from "@mzawadie/views/products/urls";
import ProductUpdateComponent from "@mzawadie/views/products/views/ProductUpdate";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const ProductUpdate: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: ProductUrlQueryParams = qs;

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.products)} />
            <ProductUpdateComponent
                id={router.query.id}
                params={{
                    ...params,
                    ids: getArrayQueryParam(qs.ids),
                }}
            />
        </>
    );
};

ProductUpdate.layout = AppLayout;
ProductUpdate.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default ProductUpdate;
