// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { maybe } from "@mzawadie/core/misc";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useUser from "@mzawadie/hooks/useUser";
import Attributes from "@mzawadie/icons/Attributes";
import Channels from "@mzawadie/icons/Channels";
import Navigation from "@mzawadie/icons/Navigation";
import PageTypes from "@mzawadie/icons/PageTypes";
import Pages from "@mzawadie/icons/Pages";
import PermissionGroups from "@mzawadie/icons/PermissionGroups";
import Plugins from "@mzawadie/icons/Plugins";
import ProductTypes from "@mzawadie/icons/ProductTypes";
import ShippingMethods from "@mzawadie/icons/ShippingMethods";
import SiteSettings from "@mzawadie/icons/SiteSettings";
import StaffMembers from "@mzawadie/icons/StaffMembers";
import Taxes from "@mzawadie/icons/Taxes";
import Warehouses from "@mzawadie/icons/Warehouses";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { attributeListUrl } from "@mzawadie/views/attributes/urls";
import { channelsListUrl } from "@mzawadie/views/channels/urls";
import { menuListUrl } from "@mzawadie/views/navigation/urls";
import { pageTypeListUrl } from "@mzawadie/views/pageTypes/urls";
import { pageListUrl } from "@mzawadie/views/pages/urls";
import { permissionGroupListUrl } from "@mzawadie/views/permissionGroups/urls";
import { pluginListUrl } from "@mzawadie/views/plugins/urls";
import { productTypeListUrl } from "@mzawadie/views/productTypes/urls";
import { shippingZonesListUrl } from "@mzawadie/views/shipping/urls";
import { siteSettingsUrl } from "@mzawadie/views/siteSettings/urls";
import { staffListUrl } from "@mzawadie/views/staff/urls";
import { taxSection } from "@mzawadie/views/taxes/urls";
import { warehouseSection } from "@mzawadie/views/warehouses/urls";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import ConfigurationPage, { MenuSection } from "./ConfigurationPage";

export function createConfigurationMenu(intl: IntlShape): MenuSection[] {
    return [
        {
            label: intl.formatMessage({
                defaultMessage: "Attributes and Product Types",
                id: "HP6m+q",
            }),
            menuItems: [
                {
                    description: intl.formatMessage({
                        defaultMessage: "Determine attributes used to create product types",
                        id: "19/lwV",
                    }),
                    icon: <Attributes fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                    title: intl.formatMessage(sectionNames.attributes),
                    url: attributeListUrl(),
                    testId: "configurationMenuAttributes",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "Define types of products you sell",
                        id: "n0RwMK",
                    }),
                    icon: <ProductTypes fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                    title: intl.formatMessage(sectionNames.productTypes),
                    url: productTypeListUrl(),
                    testId: "configurationMenuProductTypes",
                },
            ],
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Product Settings",
                id: "jFrdB5",
            }),
            menuItems: [
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage how your store charges tax",
                        id: "EIULpW",
                    }),
                    icon: <Taxes fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_SETTINGS,
                    title: intl.formatMessage(sectionNames.taxes),
                    url: taxSection,
                    testId: "configurationMenuTaxes",
                },
            ],
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Staff Settings",
                id: "UN+yTt",
            }),
            menuItems: [
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage your employees and their permissions",
                        id: "RQUkVW",
                    }),
                    icon: <StaffMembers fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_STAFF,
                    title: intl.formatMessage(sectionNames.staff),
                    url: staffListUrl(),
                    testId: "configurationMenuStaff",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage your permission groups and their permissions",
                        id: "ivJ1qt",
                    }),
                    icon: <PermissionGroups fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_STAFF,
                    title: intl.formatMessage(sectionNames.permissionGroups),
                    url: permissionGroupListUrl(),
                    testId: "configurationMenuPermissionGroups",
                },
            ],
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Shipping Settings",
                id: "gTr0qE",
            }),
            menuItems: [
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage how you ship out orders",
                        id: "zxs6G3",
                    }),
                    icon: <ShippingMethods fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_SHIPPING,
                    title: intl.formatMessage(sectionNames.shipping),
                    url: shippingZonesListUrl(),
                    testId: "configurationMenuShipping",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage and update your warehouse information",
                        id: "5RmuD+",
                    }),
                    icon: <Warehouses fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_PRODUCTS,
                    title: intl.formatMessage(sectionNames.warehouses),
                    url: warehouseSection,
                    testId: "configurationMenuWarehouses",
                },
            ],
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Content Management",
                id: "HjXnIf",
            }),
            menuItems: [
                {
                    description: intl.formatMessage({
                        defaultMessage: "Define types of content pages used in your store",
                        id: "JPH/uP",
                    }),
                    icon: <PageTypes fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_PAGES,
                    title: intl.formatMessage(sectionNames.pageTypes),
                    url: pageTypeListUrl(),
                    testId: "configurationMenuPageTypes",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage and add additional pages",
                        id: "4CgHai",
                    }),
                    icon: <Pages fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_PAGES,
                    title: intl.formatMessage(sectionNames.pages),
                    url: pageListUrl(),
                    testId: "configurationMenuPages",
                },
            ],
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Multichannel",
                id: "MWSacl",
            }),
            menuItems: [
                {
                    description: intl.formatMessage({
                        defaultMessage: "Define and manage your sales channels",
                        id: "8vJCJ4",
                    }),
                    icon: <Channels fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_CHANNELS,
                    title: intl.formatMessage(sectionNames.channels),
                    url: channelsListUrl(),
                    testId: "configurationMenuChannels",
                },
            ],
        },
        {
            label: intl.formatMessage({
                defaultMessage: "Miscellaneous",
                id: "YZl6cv",
            }),
            menuItems: [
                {
                    description: intl.formatMessage({
                        defaultMessage: "Define how users can navigate through your store",
                        id: "hpMcW8",
                    }),
                    icon: <Navigation fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_MENUS,
                    title: intl.formatMessage(sectionNames.navigation),
                    url: menuListUrl(),
                    testId: "configurationMenuNavigation",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "View and update your site settings",
                        id: "5BajZK",
                    }),
                    icon: <SiteSettings fontSize="inherit" viewBox="0 0 44 44" />,
                    permission: PermissionEnum.MANAGE_SETTINGS,
                    title: intl.formatMessage(sectionNames.siteSettings),
                    url: siteSettingsUrl(),
                    testId: "configurationMenuSiteSettings",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "View and update your plugins and their settings.",
                        id: "m19JfL",
                    }),
                    icon: (
                        <Plugins
                            fontSize="inherit"
                            viewBox="-8 -5 44 44"
                            preserveAspectRatio="xMinYMin meet"
                        />
                    ),
                    permission: PermissionEnum.MANAGE_PLUGINS,
                    title: intl.formatMessage(sectionNames.plugins),
                    url: pluginListUrl(),
                    testId: "configurationPluginsPages",
                },
            ],
        },
    ];
}

export const configurationMenuUrl = "/configuration/";

export const ConfigurationSection: React.FC = () => {
    const navigate = useNavigator();

    const intl = useIntl();

    const { user } = useUser();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.configuration)} />

            <ConfigurationPage
                menu={createConfigurationMenu(intl)}
                user={maybe(() => user)}
                onSectionClick={navigate}
            />
        </>
    );
};

export default ConfigurationSection;
