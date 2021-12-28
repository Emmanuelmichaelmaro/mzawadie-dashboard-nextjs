// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { asSortParams } from "@mzawadie/utils/sort";
import { CustomerListUrlQueryParams, CustomerListUrlSortField } from "@mzawadie/views/customers/urls";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";

import CustomerListViewComponent from "../../views/customers/views/CustomerList";

const CustomerListView: React.FC = () => {
    const router = useRouter();
    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;
    const params: CustomerListUrlQueryParams = asSortParams(qs, CustomerListUrlSortField);

    return <CustomerListViewComponent params={params} />;
};

CustomerListView.layout = AppLayout;
CustomerListView.permissions = [PermissionEnum.MANAGE_USERS];

export default CustomerListView;
