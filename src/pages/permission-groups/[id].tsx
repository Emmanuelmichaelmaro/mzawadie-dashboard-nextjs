// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { asSortParams } from "@mzawadie/utils/sort";
import {
    PermissionGroupDetailsUrlQueryParams,
    MembersListUrlSortField,
} from "@mzawadie/views/permissionGroups/urls";
import PermissionGroupDetailsComponent from "@mzawadie/views/permissionGroups/views/PermissionGroupDetails";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const PermissionGroupDetails: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: PermissionGroupDetailsUrlQueryParams = asSortParams(qs, MembersListUrlSortField);

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
            <PermissionGroupDetailsComponent id={router.query.id} params={params} />
        </>
    );
};

PermissionGroupDetails.layout = AppLayout;
PermissionGroupDetails.permissions = [PermissionEnum.MANAGE_STAFF];

export default PermissionGroupDetails;
