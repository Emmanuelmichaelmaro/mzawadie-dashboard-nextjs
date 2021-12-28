// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { PermissionEnum } from "@mzawadie/sdk/lib/src";
import { SiteSettingsUrlQueryParams } from "@mzawadie/views/siteSettings/urls";
import SiteSettingsComponent from "@mzawadie/views/siteSettings/views/";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";

const SiteSettings: React.FC = () => {
    const router = useRouter();
    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;
    const params: SiteSettingsUrlQueryParams = qs;

    return <SiteSettingsComponent params={params} />;
};

SiteSettings.layout = AppLayout;
SiteSettings.permissions = [PermissionEnum.MANAGE_SETTINGS];

export default SiteSettings;
