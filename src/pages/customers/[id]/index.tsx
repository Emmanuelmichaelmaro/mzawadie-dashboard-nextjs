// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { CustomerUrlQueryParams } from "@mzawadie/views/customers/urls";
import CustomerDetailsViewComponent from "@mzawadie/views/customers/views/CustomerDetails";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";

const CustomerDetailsView: React.FC = () => {
    const router = useRouter();
    const params: CustomerUrlQueryParams =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    // @ts-ignore
    return <CustomerDetailsViewComponent id={router.query.id} params={params} />;
};

CustomerDetailsView.layout = AppLayout;
CustomerDetailsView.permissions = [PermissionEnum.MANAGE_USERS];

export default CustomerDetailsView;
