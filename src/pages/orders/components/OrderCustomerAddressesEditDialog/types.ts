import { AddressInput, AddressTypeEnum } from "@mzawadie/types/globalTypes";

export interface OrderCustomerSearchAddressState {
    open: boolean;
    type: AddressTypeEnum;
}
export interface OrderCustomerAddressesEditDialogOutput {
    shippingAddress: AddressInput;
    billingAddress: AddressInput;
}
export enum AddressEditDialogVariant {
    CHANGE_CUSTOMER,
    CHANGE_SHIPPING_ADDRESS,
    CHANGE_BILLING_ADDRESS,
}
