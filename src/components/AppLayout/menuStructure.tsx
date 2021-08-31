import { SidebarMenuItem } from "@saleor/macaw-ui"
import { IntlShape } from "react-intl"

import appsIcon from "../../../assets/images/menu-apps-icon.svg"
import CatalogIcon from "../../../assets/images/menu-catalog-icon.svg"
import customerIcon from "../../../assets/images/menu-customers-icon.svg"
import HomeIcon from "../../../assets/images/menu-home-icon.svg"
import { PermissionEnum, User } from "../../../generated/graphql"
import { commonMessages, sectionNames } from "../../intl"

interface FilterableMenuItem extends Omit<SidebarMenuItem, "children"> {
    children?: FilterableMenuItem[]
    permissions?: PermissionEnum[]
}

function createMenuStructure(intl: IntlShape, user: User): SidebarMenuItem[] {
    const menuItems: FilterableMenuItem[] = [
        {
            ariaLabel: "home",
            iconSrc: HomeIcon,
            label: intl.formatMessage(sectionNames.home),
            id: "home",
            url: "/",
        },
        // {
        //     ariaLabel: "catalogue",
        //     children: [
        //         {
        //             ariaLabel: "products",
        //             label: intl.formatMessage(sectionNames.products),
        //             id: "products",
        //             // url: productListUrl(),
        //         },
        //         {
        //             ariaLabel: "categories",
        //             label: intl.formatMessage(sectionNames.categories),
        //             id: "categories",
        //             // url: categoryListUrl(),
        //         },
        //         {
        //             ariaLabel: "collections",
        //             label: intl.formatMessage(sectionNames.collections),
        //             id: "collections",
        //             // url: collectionListUrl(),
        //         },
        //         {
        //             ariaLabel: "giftCards",
        //             label: intl.formatMessage(sectionNames.giftCards),
        //             id: "giftCards",
        //             // url: giftCardsListUrl(),
        //         },
        //     ],
        //     iconSrc: CatalogIcon,
        //     label: intl.formatMessage(commonMessages.catalog),
        //     permissions: [PermissionEnum.ManageProducts],
        //     id: "catalogue",
        // },
        {
            ariaLabel: "apps",
            iconSrc: appsIcon,
            label: intl.formatMessage(sectionNames.apps),
            // permissions: [PermissionEnum.MANAGE_APPS],
            id: "apps",
            url: "/apps",
        },
        {
            ariaLabel: "customers",
            iconSrc: customerIcon,
            label: intl.formatMessage(sectionNames.customers),
            // permissions: [PermissionEnum.MANAGE_USERS],
            id: "customers",
            url: "/customers",
        },
    ]

    return menuItems.filter(
        (menuItem) =>
            !menuItem.permissions ||
            (user?.userPermissions || []).some((permission: any) =>
                menuItem?.permissions?.includes(permission.code)
            )
    )
}

export default createMenuStructure
