// @ts-nocheck
import { orderDraftListUrl, orderListUrl } from "@mzawadie/views/orders/urls";
import { SidebarMenuItem } from "@saleor/macaw-ui";
import { matchPath } from "react-router";

export function isMenuActive(location: string, menuItem: SidebarMenuItem) {
    if (menuItem.children) {
        return menuItem.children.reduce(
            (acc, subMenuItem) => acc || isMenuActive(location, subMenuItem),
            false
        );
    }

    const activeUrl = location.split("?")[0];
    const menuItemUrl = menuItem?.url?.split("?")[0];

    return activeUrl === orderDraftListUrl().split("?")[0] &&
        menuItemUrl === orderListUrl().split("?")[0]
        ? false
        : !!matchPath(activeUrl, {
              exact: menuItemUrl === "/",
              path: menuItemUrl,
          });
}
