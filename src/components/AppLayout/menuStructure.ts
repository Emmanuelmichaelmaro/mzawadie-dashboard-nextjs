// @ts-nocheck
import appsIcon from "@assets/images/menu-apps-icon.svg";
import catalogIcon from "@assets/images/menu-catalog-icon.svg";
import configurationIcon from "@assets/images/menu-configure-icon.svg";
import customerIcon from "@assets/images/menu-customers-icon.svg";
import discountsIcon from "@assets/images/menu-discounts-icon.svg";
import homeIcon from "@assets/images/menu-home-icon.svg";
import ordersIcon from "@assets/images/menu-orders-icon.svg";
import pagesIcon from "@assets/images/menu-pages-icon.svg";
import translationIcon from "@assets/images/menu-translation-icon.svg";
import { commonMessages, sectionNames } from "@mzawadie/core";
import { User } from "@mzawadie/fragments/types/User";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { SidebarMenuItem } from "@saleor/macaw-ui";
import { IntlShape } from "react-intl";

import { appsListPath } from "../../pages/apps/urls";
import { extensionMountPoints, useExtensions } from "../../pages/apps/useExtensions";
import { categoryListUrl } from "../../pages/categories/urls";
import { collectionListUrl } from "../../pages/collections/urls";
import { configurationMenuUrl } from "../../pages/configuration";
import { getConfigMenuItemsPermissions } from "../../pages/configuration/utils";
import { customerListUrl } from "../../pages/customers/urls";
import { saleListUrl, voucherListUrl } from "../../pages/discounts/urls";
import { giftCardListUrl } from "../../pages/giftCards/urls";
import { orderDraftListUrl, orderListUrl } from "../../pages/orders/urls";
import { pageListPath } from "../../pages/pages/urls";
import { productListUrl } from "../../pages/products/urls";
import { languageListUrl } from "../../pages/translations/urls";
import { getMenuItemExtension, mapToExtensionsItems } from "./utils";

export interface FilterableMenuItem extends Omit<SidebarMenuItem, "children"> {
    children?: FilterableMenuItem[];
    permissions?: PermissionEnum[];
}

function useMenuStructure(
    intl: IntlShape,
    user: User
): [SidebarMenuItem[], (menuItem: SidebarMenuItem) => void] {
    const navigate = useNavigator();
    const extensions = useExtensions(extensionMountPoints.NAVIGATION_SIDEBAR);

    const handleMenuItemClick = (menuItem: SidebarMenuItem) => {
        const extension = getMenuItemExtension(extensions, menuItem);
        if (extension) {
            extension.open();
            return;
        }
        navigate(menuItem.url, { resetScroll: true });
    };

    const appExtensionsHeaderItem = {
        id: "extensions",
        ariaLabel: "apps",
        label: intl.formatMessage(sectionNames.appExtensions),
    };

    const menuItems: FilterableMenuItem[] = [
        {
            ariaLabel: "home",
            iconSrc: homeIcon,
            label: intl.formatMessage(sectionNames.home),
            id: "home",
            url: "/",
        },
        {
            ariaLabel: "catalogue",
            children: [
                {
                    ariaLabel: "products",
                    label: intl.formatMessage(sectionNames.products),
                    id: "products",
                    url: productListUrl(),
                    permissions: [PermissionEnum.MANAGE_PRODUCTS],
                },
                {
                    ariaLabel: "categories",
                    label: intl.formatMessage(sectionNames.categories),
                    id: "categories",
                    url: categoryListUrl(),
                    permissions: [PermissionEnum.MANAGE_PRODUCTS],
                },
                {
                    ariaLabel: "collections",
                    label: intl.formatMessage(sectionNames.collections),
                    id: "collections",
                    url: collectionListUrl(),
                    permissions: [PermissionEnum.MANAGE_PRODUCTS],
                },
                {
                    ariaLabel: "giftCards",
                    label: intl.formatMessage(sectionNames.giftCards),
                    id: "giftCards",
                    url: giftCardListUrl(),
                    permissions: [PermissionEnum.MANAGE_GIFT_CARD],
                },
                ...mapToExtensionsItems(extensions.NAVIGATION_CATALOG, appExtensionsHeaderItem),
            ],
            iconSrc: catalogIcon,
            label: intl.formatMessage(commonMessages.catalog),
            permissions: [PermissionEnum.MANAGE_GIFT_CARD, PermissionEnum.MANAGE_PRODUCTS],
            id: "catalogue",
        },
        {
            ariaLabel: "discounts",
            children: [
                {
                    ariaLabel: "sales",
                    label: intl.formatMessage(sectionNames.sales),
                    id: "sales",
                    url: saleListUrl(),
                },
                {
                    ariaLabel: "vouchers",
                    label: intl.formatMessage(sectionNames.vouchers),
                    id: "vouchers",
                    url: voucherListUrl(),
                },
                ...mapToExtensionsItems(extensions.NAVIGATION_DISCOUNTS, appExtensionsHeaderItem),
            ],
            iconSrc: discountsIcon,
            label: intl.formatMessage(commonMessages.discounts),
            permissions: [PermissionEnum.MANAGE_DISCOUNTS],
            id: "discounts",
        },
        {
            ariaLabel: "orders",
            children: [
                {
                    ariaLabel: "orders",
                    label: intl.formatMessage(sectionNames.orders),
                    permissions: [PermissionEnum.MANAGE_ORDERS],
                    id: "orders",
                    url: orderListUrl(),
                },
                {
                    ariaLabel: "order drafts",
                    label: intl.formatMessage(commonMessages.drafts),
                    permissions: [PermissionEnum.MANAGE_ORDERS],
                    id: "order-drafts",
                    url: orderDraftListUrl(),
                },
                ...mapToExtensionsItems(extensions.NAVIGATION_ORDERS, appExtensionsHeaderItem),
            ],
            iconSrc: ordersIcon,
            label: intl.formatMessage(sectionNames.orders),
            permissions: [PermissionEnum.MANAGE_ORDERS],
            id: "orders",
        },
        {
            ariaLabel: "customers",
            children: extensions.NAVIGATION_CUSTOMERS.length > 0 && [
                {
                    ariaLabel: "customers",
                    label: intl.formatMessage(sectionNames.customers),
                    permissions: [PermissionEnum.MANAGE_USERS],
                    id: "customers",
                    url: customerListUrl(),
                },
                ...mapToExtensionsItems(extensions.NAVIGATION_CUSTOMERS, appExtensionsHeaderItem),
            ],
            iconSrc: customerIcon,
            label: intl.formatMessage(sectionNames.customers),
            permissions: [PermissionEnum.MANAGE_USERS],
            id: "customers",
            url: customerListUrl(),
        },
        {
            ariaLabel: "pages",
            children: extensions.NAVIGATION_PAGES.length > 0 && [
                {
                    ariaLabel: "pages",
                    label: intl.formatMessage(sectionNames.pages),
                    permissions: [PermissionEnum.MANAGE_PAGES],
                    id: "pages",
                    url: pageListPath,
                },
                ...mapToExtensionsItems(extensions.NAVIGATION_PAGES, appExtensionsHeaderItem),
            ],
            iconSrc: pagesIcon,
            label: intl.formatMessage(sectionNames.pages),
            permissions: [PermissionEnum.MANAGE_PAGES],
            id: "pages",
            url: pageListPath,
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
            children: extensions.NAVIGATION_TRANSLATIONS.length > 0 && [
                {
                    ariaLabel: "translations",
                    label: intl.formatMessage(sectionNames.translations),
                    permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
                    id: "translations",
                    url: languageListUrl,
                },
                ...mapToExtensionsItems(extensions.NAVIGATION_TRANSLATIONS, appExtensionsHeaderItem),
            ],
            iconSrc: translationIcon,
            label: intl.formatMessage(sectionNames.translations),
            permissions: [PermissionEnum.MANAGE_TRANSLATIONS],
            id: "translations",
            url: languageListUrl,
        },
        {
            ariaLabel: "configure",
            iconSrc: configurationIcon,
            label: intl.formatMessage(sectionNames.configuration),
            permissions: getConfigMenuItemsPermissions(intl),
            id: "configure",
            url: configurationMenuUrl,
        },
    ];

    const isMenuItemPermitted = (menuItem: FilterableMenuItem) =>
        !menuItem.permissions ||
        (user?.userPermissions || []).some((permission) =>
            menuItem.permissions.includes(permission.code)
        );

    const getFilteredMenuItems = (menuItems: FilterableMenuItem[]) =>
        menuItems.filter(isMenuItemPermitted);

    return [
        menuItems.reduce((resultItems: FilterableMenuItem[], menuItem: FilterableMenuItem) => {
            const { children } = menuItem;

            if (!isMenuItemPermitted(menuItem)) {
                return resultItems;
            }

            const filteredChildren = children ? getFilteredMenuItems(children) : undefined;

            return [...resultItems, { ...menuItem, children: filteredChildren }];
        }, [] as FilterableMenuItem[]),
        handleMenuItemClick,
    ];
}

export default useMenuStructure;
