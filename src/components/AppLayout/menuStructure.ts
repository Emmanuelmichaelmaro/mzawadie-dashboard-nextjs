// @ts-nocheck
import appsIcon from "@assets/images/menu-apps-icon.svg";
import catalogIcon from "@assets/images/menu-catalog-icon.svg";
import configurationIcon from "@assets/images/menu-configure-icon.svg";
import customerIcon from "@assets/images/menu-customers-icon.svg";
import homeIcon from "@assets/images/menu-home-icon.svg";
import translationIcon from "@assets/images/menu-translation-icon.svg";
import { commonMessages, sectionNames } from "@mzawadie/core";
import { User } from "@mzawadie/fragments/types/User";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { SidebarMenuItem } from "@saleor/macaw-ui";
import { IntlShape } from "react-intl";
import { configurationMenuUrl, createConfigurationMenu } from "@mzawadie/views/configuration";
import { customerListUrl } from "@mzawadie/views/customers/urls";
import { appsListPath } from "@mzawadie/views/apps/urls";
import { categoryListUrl } from "@mzawadie/views/categories/urls";
import { collectionListUrl } from "@mzawadie/views/collections/urls";
import { productListUrl } from "@mzawadie/views/products/urls";
import { MenuItem } from "@mzawadie/views/configuration/ConfigurationPage";
import { languageListUrl } from "@mzawadie/views/translations/urls";

interface FilterableMenuItem extends Omit<SidebarMenuItem, "children"> {
    children?: FilterableMenuItem[];
    permissions?: PermissionEnum[];
}

function createMenuStructure(intl: IntlShape, user: User): SidebarMenuItem[] {
    const configurationMenu = createConfigurationMenu(intl);

    const menuItems: FilterableMenuItem[] = [
        {
            ariaLabel: "home",
            iconSrc: homeIcon,
            label: intl.formatMessage(sectionNames.home),
            id: "home",
            url: "/home",
        },
        // {
        //     ariaLabel: "orders",
        //     children: [
        //         {
        //             ariaLabel: "orders",
        //             label: intl.formatMessage(sectionNames.orders),
        //             permissions: [PermissionEnum.MANAGE_ORDERS],
        //             id: "orders",
        //             url: orderListUrl()
        //         },
        //         {
        //             ariaLabel: "order drafts",
        //             label: intl.formatMessage(commonMessages.drafts),
        //             permissions: [PermissionEnum.MANAGE_ORDERS],
        //             id: "order drafts",
        //             url: orderDraftListUrl()
        //         }
        //     ],
        //     iconSrc: ordersIcon,
        //     label: intl.formatMessage(sectionNames.orders),
        //     permissions: [PermissionEnum.MANAGE_ORDERS],
        //     id: "orders"
        // },
        {
            ariaLabel: "catalogue",
            children: [
                {
                    ariaLabel: "products",
                    label: intl.formatMessage(sectionNames.products),
                    id: "products",
                    url: productListUrl()
                },
                {
                    ariaLabel: "categories",
                    label: intl.formatMessage(sectionNames.categories),
                    id: "categories",
                    url: categoryListUrl()
                },
                {
                    ariaLabel: "collections",
                    label: intl.formatMessage(sectionNames.collections),
                    id: "collections",
                    url: collectionListUrl()
                }
            ],
            iconSrc: catalogIcon,
            label: intl.formatMessage(commonMessages.catalog),
            permissions: [PermissionEnum.MANAGE_PRODUCTS],
            id: "catalogue"
        },
        // {
        //     ariaLabel: "discounts",
        //     children: [
        //         {
        //             ariaLabel: "sales",
        //             label: intl.formatMessage(sectionNames.sales),
        //             id: "sales",
        //             url: saleListUrl()
        //         },
        //         {
        //             ariaLabel: "vouchers",
        //             label: intl.formatMessage(sectionNames.vouchers),
        //             id: "vouchers",
        //             url: voucherListUrl()
        //         }
        //     ],
        //     iconSrc: discountsIcon,
        //     label: intl.formatMessage(commonMessages.discounts),
        //     permissions: [PermissionEnum.MANAGE_DISCOUNTS],
        //     id: "discounts"
        // },
        {
            ariaLabel: "customers",
            iconSrc: customerIcon,
            label: intl.formatMessage(sectionNames.customers),
            permissions: [PermissionEnum.MANAGE_USERS],
            id: "customers",
            url: customerListUrl(),
        },
        {
            ariaLabel: "apps",
            iconSrc: appsIcon,
            label: intl.formatMessage(sectionNames.apps),
            permissions: [PermissionEnum.MANAGE_APPS],
            id: "apps",
            url: appsListPath,
        },
        {
            ariaLabel: "translations",
            iconSrc: translationIcon,
            label: intl.formatMessage(sectionNames.translations),
            permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
            id: "translations",
            url: languageListUrl
        },
        {
            ariaLabel: "configure",
            iconSrc: configurationIcon,
            label: intl.formatMessage(sectionNames.configuration),
            permissions: configurationMenu
                .reduce(
                    (sections: any, section: any) => [...sections, ...section.menuItems],
                    [] as MenuItem[]
                )
                .map((section: any) => section.permission),
            id: "configure",
            url: configurationMenuUrl,
        },
    ];

    return menuItems.filter(
        (menuItem) =>
            !menuItem.permissions ||
            (user?.userPermissions || []).some((permission) =>
                // eslint-disable-next-line prettier/prettier
                menuItem.permissions?.includes(<PermissionEnum>permission?.code)
            )
    );
}

export default createMenuStructure;
