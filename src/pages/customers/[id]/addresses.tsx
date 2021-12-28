// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { CustomerAddressesUrlQueryParams } from "@mzawadie/views/customers/urls";
import CustomerAddressesViewComponent from "@mzawadie/views/customers/views/CustomerAddresses";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";

const CustomerAddressesView: React.FC = () => {
    const router = useRouter();
    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;
    const params: CustomerAddressesUrlQueryParams = qs;

    // @ts-ignore
    return <CustomerAddressesViewComponent id={router.query.id} params={params} />;
};

CustomerAddressesView.layout = AppLayout;
CustomerAddressesView.permissions = [PermissionEnum.MANAGE_USERS];

export default CustomerAddressesView;
