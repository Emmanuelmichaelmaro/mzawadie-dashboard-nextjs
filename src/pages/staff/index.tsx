// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { asSortParams } from "@mzawadie/utils/sort";
import { StaffListUrlSortField, StaffListUrlQueryParams } from "@mzawadie/views/staff/urls";
import StaffListComponent from "@mzawadie/views/staff/views/StaffList";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const StaffList: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: StaffListUrlQueryParams = asSortParams(qs, StaffListUrlSortField);

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
            <StaffListComponent params={params} />
        </>
    );
};

StaffList.layout = AppLayout;
StaffList.permissions = [PermissionEnum.MANAGE_STAFF];

export default StaffList;
