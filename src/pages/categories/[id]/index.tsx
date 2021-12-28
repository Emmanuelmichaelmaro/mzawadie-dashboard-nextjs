// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { CategoryUrlQueryParams } from "@mzawadie/views/categories/urls";
import CategoryDetailsView, { getActiveTab } from "@mzawadie/views/categories/views/CategoryDetails";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const CategoryDetails: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: CategoryUrlQueryParams = {
        ...qs,
        activeTab: getActiveTab(qs.activeTab),
    };

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.categories)} />
            <CategoryDetailsView id={router.query.id} params={params} />
        </>
    );
};

// @ts-ignore
CategoryDetails.layout = AppLayout;
CategoryDetails.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default CategoryDetails;
