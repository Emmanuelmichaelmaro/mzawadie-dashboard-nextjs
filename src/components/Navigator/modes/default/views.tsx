// import { appsListUrl } from "@mzawadie/pages/apps/urls";
// import { attributeListUrl } from "@mzawadie/pages/attributes/urls";
// import { categoryListUrl } from "@mzawadie/pages/categories/urls";
// import { collectionListUrl } from "@mzawadie/pages/collections/urls";
// import { customerListUrl } from "@mzawadie/pages/customers/urls";
// import { saleListUrl, voucherListUrl } from "@mzawadie/pages/discounts/urls";
import { sectionNames } from "@mzawadie/core";
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";
// import { menuListUrl } from "@mzawadie/pages/navigation/urls";
// import { orderDraftListUrl, orderListUrl } from "@mzawadie/pages/orders/urls";
// import { pageListUrl } from "@mzawadie/pages/pages/urls";
// import { permissionGroupListUrl } from "@mzawadie/pages/permissionGroups/urls";
// import { pluginListUrl } from "@mzawadie/pages/plugins/urls";
// import { productListUrl } from "@mzawadie/pages/products/urls";
// import { productTypeListUrl } from "@mzawadie/pages/productTypes/urls";
// import { shippingZonesListUrl } from "@mzawadie/pages/shipping/urls";
// import { siteSettingsUrl } from "@mzawadie/pages/siteSettings/urls";
// import { staffListUrl } from "@mzawadie/pages/staff/urls";
// import { countryListUrl } from "@mzawadie/pages/taxes/urls";
// import { languageListUrl } from "@mzawadie/pages/translations/urls";
// import { warehouseListUrl } from "@mzawadie/pages/warehouses/urls";
import { score } from "fuzzaldrin";
import { IntlShape } from "react-intl";

import { QuickSearchActionInput } from "../../types";

interface View {
    label: string;
    url: string;
}
function searchInViews(
    search: string,
    intl: IntlShape,
    navigate: UseNavigatorResult
): QuickSearchActionInput[] {
    const views: View[] = [
        // {
        //   label: intl.formatMessage(sectionNames.apps),
        //   url: appsListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.attributes),
        //   url: attributeListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.categories),
        //   url: categoryListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.collections),
        //   url: collectionListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.customers),
        //   url: customerListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.draftOrders),
        //   url: orderDraftListUrl()
        // },
        {
            label: intl.formatMessage(sectionNames.home),
            url: "/",
        },
        // {
        //   label: intl.formatMessage(sectionNames.navigation),
        //   url: menuListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.orders),
        //   url: orderListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.pages),
        //   url: pageListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.permissionGroups),
        //   url: permissionGroupListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.plugins),
        //   url: pluginListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.productTypes),
        //   url: productTypeListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.products),
        //   url: productListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.sales),
        //   url: saleListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.shipping),
        //   url: shippingZonesListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.siteSettings),
        //   url: siteSettingsUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.staff),
        //   url: staffListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.taxes),
        //   url: countryListUrl
        // },
        // {
        //   label: intl.formatMessage(sectionNames.translations),
        //   url: languageListUrl
        // },
        // {
        //   label: intl.formatMessage(sectionNames.vouchers),
        //   url: voucherListUrl()
        // },
        // {
        //   label: intl.formatMessage(sectionNames.warehouses),
        //   url: warehouseListUrl()
        // }
    ];

    return views.map((view) => ({
        label: view.label,
        onClick: () => {
            navigate(view.url);
            return false;
        },
        score: score(view.label, search),
        text: view.label,
        type: "view",
    }));
}

export default searchInViews;
