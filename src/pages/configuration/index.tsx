// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { APP_VERSION as dashboardVersion, sectionNames, maybe } from "@mzawadie/core";
import useShop from "@mzawadie/hooks/useShop";
import Attributes from "@mzawadie/icons/Attributes";
import Channels from "@mzawadie/icons/Channels";
import Navigation from "@mzawadie/icons/Navigation";
import PageTypes from "@mzawadie/icons/PageTypes";
import PermissionGroups from "@mzawadie/icons/PermissionGroups";
import Plugins from "@mzawadie/icons/Plugins";
import ProductTypes from "@mzawadie/icons/ProductTypes";
import ShippingMethods from "@mzawadie/icons/ShippingMethods";
import SiteSettings from "@mzawadie/icons/SiteSettings";
import StaffMembers from "@mzawadie/icons/StaffMembers";
import Taxes from "@mzawadie/icons/Taxes";
import Warehouses from "@mzawadie/icons/Warehouses";
import { attributeListUrl } from "@mzawadie/pages/attributes/urls";
import { useUser } from "@mzawadie/pages/auth";
import { channelsListUrl } from "@mzawadie/pages/channels/urls";
import { menuListUrl } from "@mzawadie/pages/navigation/urls";
import { pageTypeListUrl } from "@mzawadie/pages/pageTypes/urls";
import { permissionGroupListUrl } from "@mzawadie/pages/permissionGroups/urls";
import { pluginListUrl } from "@mzawadie/pages/plugins/urls";
import { productTypeListUrl } from "@mzawadie/pages/productTypes/urls";
import { shippingZonesListUrl } from "@mzawadie/pages/shipping/urls";
import { siteSettingsUrl } from "@mzawadie/pages/siteSettings/urls";
import { staffListUrl } from "@mzawadie/pages/staff/urls";
import { taxSection } from "@mzawadie/pages/taxes/urls";
import { warehouseSection } from "@mzawadie/pages/warehouses/urls";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { ConfigurationPage, MenuSection } from "./ConfigurationPage";

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
                    icon: <Attributes />,
                    permissions: [
                        PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                        PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                    ],
                    title: intl.formatMessage(sectionNames.attributes),
                    url: attributeListUrl(),
                    testId: "configuration-menu-attributes",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "Define types of products you sell",
                        id: "n0RwMK",
                    }),
                    icon: <ProductTypes />,
                    permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
                    title: intl.formatMessage(sectionNames.productTypes),
                    url: productTypeListUrl(),
                    testId: "configuration-menu-product-types",
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
                    icon: <Taxes />,
                    permissions: [PermissionEnum.MANAGE_SETTINGS],
                    title: intl.formatMessage(sectionNames.taxes),
                    url: taxSection,
                    testId: "configuration-menu-taxes",
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
                    icon: <StaffMembers />,
                    permissions: [PermissionEnum.MANAGE_STAFF],
                    title: intl.formatMessage(sectionNames.staff),
                    url: staffListUrl(),
                    testId: "configuration-menu-staff",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage your permission groups and their permissions",
                        id: "ivJ1qt",
                    }),
                    icon: <PermissionGroups />,
                    permissions: [PermissionEnum.MANAGE_STAFF],
                    title: intl.formatMessage(sectionNames.permissionGroups),
                    url: permissionGroupListUrl(),
                    testId: "configuration-menu-permission-groups",
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
                    icon: <ShippingMethods />,
                    permissions: [PermissionEnum.MANAGE_SHIPPING],
                    title: intl.formatMessage(sectionNames.shipping),
                    url: shippingZonesListUrl(),
                    testId: "configurationMenuShipping",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "Manage and update your warehouse information",
                        id: "5RmuD+",
                    }),
                    icon: <Warehouses />,
                    permissions: [PermissionEnum.MANAGE_PRODUCTS],
                    title: intl.formatMessage(sectionNames.warehouses),
                    url: warehouseSection,
                    testId: "configuration-menu-warehouses",
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
                    icon: <Channels />,
                    permissions: [PermissionEnum.MANAGE_CHANNELS],
                    title: intl.formatMessage(sectionNames.channels),
                    url: channelsListUrl(),
                    testId: "configuration-menu-channels",
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
                    icon: <PageTypes />,
                    permissions: [
                        PermissionEnum.MANAGE_PAGES,
                        PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                    ],
                    title: intl.formatMessage(sectionNames.pageTypes),
                    url: pageTypeListUrl(),
                    testId: "configuration-menu-page-types",
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
                    icon: <Navigation />,
                    permissions: [PermissionEnum.MANAGE_MENUS],
                    title: intl.formatMessage(sectionNames.navigation),
                    url: menuListUrl(),
                    testId: "configuration-menu-navigation",
                },
                {
                    description: intl.formatMessage({
                        defaultMessage: "View and update your site settings",
                        id: "5BajZK",
                    }),
                    icon: <SiteSettings />,
                    permissions: [PermissionEnum.MANAGE_SETTINGS],
                    title: intl.formatMessage(sectionNames.siteSettings),
                    url: siteSettingsUrl(),
                    testId: "configuration-menu-site-settings",
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
                    permissions: [PermissionEnum.MANAGE_PLUGINS],
                    title: intl.formatMessage(sectionNames.plugins),
                    url: pluginListUrl(),
                    testId: "configuration-plugins-pages",
                },
            ],
        },
    ];
}

export const configurationMenuUrl = "/configuration/";

export const ConfigurationSection: React.FC = () => {
    const shop = useShop();

    const versions = {
        dashboardVersion,
        coreVersion: shop?.version ?? "",
    };

    const user = useUser();
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.configuration)} />

            <ConfigurationPage
                menu={createConfigurationMenu(intl)}
                user={maybe(() => user.user)}
                versionInfo={versions}
            />
        </>
    );
};

export default ConfigurationSection;
