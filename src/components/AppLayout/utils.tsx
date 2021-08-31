import { SidebarMenuItem } from "@saleor/macaw-ui"

export function isMenuActive(location: string, menuItem: SidebarMenuItem): any {
    if (menuItem.children) {
        return menuItem.children.reduce(
            (accumulator, subMenuItem) =>
                accumulator || isMenuActive(location, subMenuItem),
            false
        )
    }

    const activeUrl = location.split("?")[0]
    const menuItemUrl = menuItem.url?.split("?")[0]

    // return activeUrl === orderDraftListUrl().split("?")[0] &&
    //     menuItemUrl === orderListUrl().split("?")[0]
    //     ? false
    //     : !!matchPath(activeUrl, {
    //         exact: menuItemUrl === "/",
    //         path: menuItemUrl,
    //     })

    return activeUrl === menuItemUrl ? true : false
}
