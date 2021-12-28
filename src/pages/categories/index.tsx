// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { asSortParams } from "@mzawadie/utils/sort";
import { CategoryListUrlQueryParams, CategoryListUrlSortField } from "@mzawadie/views/categories/urls";
import CategoryListComponent from "@mzawadie/views/categories/views/CategoryList";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const CategoryList: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: CategoryListUrlQueryParams = {
        ...asSortParams(qs, CategoryListUrlSortField),
    };

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.categories)} />
            <CategoryListComponent params={params} />
        </>
    );
};

CategoryList.layout = AppLayout;
CategoryList.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default CategoryList;
