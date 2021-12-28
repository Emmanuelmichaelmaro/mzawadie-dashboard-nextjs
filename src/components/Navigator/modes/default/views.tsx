// import { appsListUrl } from "@mzawadie/views/apps/urls";
// import { attributeListUrl } from "@mzawadie/views/attributes/urls";
// import { categoryListUrl } from "@mzawadie/views/categories/urls";
// import { collectionListUrl } from "@mzawadie/views/collections/urls";
// import { customerListUrl } from "@mzawadie/views/customers/urls";
// import { saleListUrl, voucherListUrl } from "@mzawadie/views/discounts/urls";
import { sectionNames } from "@mzawadie/core";
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";
// import { menuListUrl } from "@mzawadie/views/navigation/urls";
// import { orderDraftListUrl, orderListUrl } from "@mzawadie/views/orders/urls";
// import { pageListUrl } from "@mzawadie/views/pages/urls";
// import { permissionGroupListUrl } from "@mzawadie/views/permissionGroups/urls";
// import { pluginListUrl } from "@mzawadie/views/plugins/urls";
// import { productListUrl } from "@mzawadie/views/products/urls";
// import { productTypeListUrl } from "@mzawadie/views/productTypes/urls";
// import { shippingZonesListUrl } from "@mzawadie/views/shipping/urls";
// import { siteSettingsUrl } from "@mzawadie/views/siteSettings/urls";
// import { staffListUrl } from "@mzawadie/views/staff/urls";
// import { countryListUrl } from "@mzawadie/views/taxes/urls";
// import { languageListUrl } from "@mzawadie/views/translations/urls";
// import { warehouseListUrl } from "@mzawadie/views/warehouses/urls";
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
