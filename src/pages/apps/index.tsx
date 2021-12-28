// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { AppListUrlQueryParams } from "@mzawadie/views/apps/urls";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";

import AppsListView from "../../views/apps/views/AppsList";

const AppsList: React.FC = () => {
    const router = useRouter();
    const params: AppListUrlQueryParams =
        // eslint-disable-next-line no-restricted-globals
        typeof window !== "undefined" ? parseQs(location.search.substr(1)) : router.query;

    return <AppsListView params={params} />;
};

AppsList.layout = AppLayout;
AppsList.permissions = [PermissionEnum.MANAGE_APPS];

export default AppsList;
