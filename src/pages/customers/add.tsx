// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import CustomerCreateView from "@mzawadie/views/customers/views/CustomerCreate";

CustomerCreateView.layout = AppLayout;
CustomerCreateView.permissions = [PermissionEnum.MANAGE_USERS];

export default CustomerCreateView;
