// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { StaffMemberDetailsUrlQueryParams } from "@mzawadie/views/staff/urls";
import StaffDetailsComponent from "@mzawadie/views/staff/views/StaffDetails";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const StaffDetails: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: StaffMemberDetailsUrlQueryParams = qs;

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.staff)} />
            <StaffDetailsComponent id={router.query.id} params={params} />
        </>
    );
};

StaffDetails.layout = AppLayout;
StaffDetails.permissions = [PermissionEnum.MANAGE_STAFF];

export default StaffDetails;
