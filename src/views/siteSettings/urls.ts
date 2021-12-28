import { Dialog } from "@mzawadie/core";
import { stringifyQs } from "@mzawadie/utils/urls";

const siteSettingsSection = "/site-settings";

export const siteSettingsPath = siteSettingsSection;
export type SiteSettingsUrlDialog = "add-key";
export type SiteSettingsUrlQueryParams = Dialog<SiteSettingsUrlDialog>;
export const siteSettingsUrl = (params?: SiteSettingsUrlQueryParams) =>
    `${siteSettingsPath}?${stringifyQs(params || { asc: "true", sort: "name" })}`;
