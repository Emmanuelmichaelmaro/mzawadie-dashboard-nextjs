/* eslint-disable prefer-destructuring */
import { ListSettings, ListViews, Pagination } from "@mzawadie/core/types";
import { SearchVariables } from "@mzawadie/hooks";

import packageInfo from "../../package.json";

export const APP_MOUNT_URI = process.env.NEXT_PUBLIC_APP_MOUNT_URI;

export const APP_DEFAULT_URI = "/";

export const API_URI = process.env.NEXT_PUBLIC_API_URI!;

export const APP_VERSION = packageInfo.version;

export const CHANNEL_SLUG = process.env.NEXT_PUBLIC_MZAWADIE_CHANNEL_SLUG!;

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;

export const DEFAULT_INITIAL_SEARCH_DATA: SearchVariables = {
    after: null,
    first: 20,
    query: "",
};

export const DEFAULT_INITIAL_PAGINATION_DATA: Pagination = {
    after: undefined,
    before: undefined,
};

export const PAGINATE_BY = 20;

export const VALUES_PAGINATE_BY = 10;

export type ProductListColumns = "productType" | "availability" | "price";

export interface AppListViewSettings {
    [ListViews.APPS_LIST]: ListSettings;
    [ListViews.ATTRIBUTE_VALUE_LIST]: ListSettings;
    [ListViews.CATEGORY_LIST]: ListSettings;
    [ListViews.COLLECTION_LIST]: ListSettings;
    [ListViews.CUSTOMER_LIST]: ListSettings;
    [ListViews.DRAFT_LIST]: ListSettings;
    [ListViews.NAVIGATION_LIST]: ListSettings;
    [ListViews.ORDER_LIST]: ListSettings;
    [ListViews.PAGES_LIST]: ListSettings;
    [ListViews.PLUGINS_LIST]: ListSettings;
    [ListViews.PRODUCT_LIST]: ListSettings<ProductListColumns>;
    [ListViews.SALES_LIST]: ListSettings;
    [ListViews.SHIPPING_METHODS_LIST]: ListSettings;
    [ListViews.STAFF_MEMBERS_LIST]: ListSettings;
    [ListViews.PERMISSION_GROUP_LIST]: ListSettings;
    [ListViews.VOUCHER_LIST]: ListSettings;
    [ListViews.WAREHOUSE_LIST]: ListSettings;
    [ListViews.WEBHOOK_LIST]: ListSettings;
    [ListViews.TRANSLATION_ATTRIBUTE_VALUE_LIST]: ListSettings;
    [ListViews.GIFT_CARD_LIST]: ListSettings;
}

export const defaultListSettings: AppListViewSettings = {
    [ListViews.APPS_LIST]: {
        rowNumber: 10,
    },
    [ListViews.ATTRIBUTE_VALUE_LIST]: {
        rowNumber: 10,
    },
    [ListViews.CATEGORY_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.COLLECTION_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.CUSTOMER_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.DRAFT_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.NAVIGATION_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.ORDER_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.PAGES_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.PLUGINS_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.PRODUCT_LIST]: {
        columns: ["availability", "price", "productType"],
        rowNumber: PAGINATE_BY,
    },
    [ListViews.SALES_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.SHIPPING_METHODS_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.STAFF_MEMBERS_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.PERMISSION_GROUP_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.VOUCHER_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.WAREHOUSE_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.WEBHOOK_LIST]: {
        rowNumber: PAGINATE_BY,
    },
    [ListViews.TRANSLATION_ATTRIBUTE_VALUE_LIST]: {
        rowNumber: 10,
    },
    [ListViews.GIFT_CARD_LIST]: {
        rowNumber: PAGINATE_BY,
    },
};
