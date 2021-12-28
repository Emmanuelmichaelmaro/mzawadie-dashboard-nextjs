// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { asSortParams } from "@mzawadie/utils/sort";
import {
    PermissionGroupListUrlQueryParams,
    PermissionGroupListUrlSortField,
} from "@mzawadie/views/permissionGroups/urls";
import PermissionGroupListComponent from "@mzawadie/views/permissionGroups/views/PermissionGroupList";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const PermissionGroupList: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: PermissionGroupListUrlQueryParams = asSortParams(qs, PermissionGroupListUrlSortField);

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
            <PermissionGroupListComponent params={params} />
        </>
    );
};

PermissionGroupList.layout = AppLayout;
PermissionGroupList.permissions = [PermissionEnum.MANAGE_STAFF];

export default PermissionGroupList;
