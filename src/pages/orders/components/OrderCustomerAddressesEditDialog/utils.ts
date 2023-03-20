// @ts-nocheck
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { flatten } from "@mzawadie/core";
import {
    AccountErrorFragment,
    AddressFragment,
    OrderErrorFragment,
    AddressTypeEnum,
} from "@mzawadie/graphql";
import { FormChange } from "@mzawadie/hooks/useForm";
import React from "react";

import { getById } from "../OrderReturnPage/utils";
import { OrderCustomerAddressEditProps } from "./OrderCustomerAddressEdit";
import { OrderCustomerAddressesEditData, OrderCustomerAddressesEditHandlers } from "./form";
import { OrderCustomerSearchAddressState } from "./types";

interface AddressEditCommonProps {
    showCard: boolean;
    loading: boolean;
    countryChoices: SingleAutocompleteChoiceType[];
    customerAddresses: AddressFragment[];
}

export const stringifyAddress = (address: Partial<AddressFragment>): string => {
    const { id, ...addressWithoutId } = address;
    return Object.values(flatten(addressWithoutId)).join(" ");
};

export const parseQuery = (query: string) => query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

export function validateDefaultAddress<T extends AddressFragment>(
    defaultAddress: Node,
    customerAddresses: T[]
): Node {
    const fallbackAddress = {
        id: customerAddresses[0]?.id,
    } as AddressFragment;
    if (!defaultAddress) {
        return fallbackAddress;
    }
    if (!customerAddresses.some(getById(defaultAddress.id))) {
        return fallbackAddress;
    }
    return defaultAddress;
}

export const getAddressEditProps = (
    variant: "shipping" | "billing",
    data: OrderCustomerAddressesEditData,
    handlers: OrderCustomerAddressesEditHandlers,
    change: FormChange,
    dialogErrors: Array<OrderErrorFragment | AccountErrorFragment>,
    setAddressSearchState: React.Dispatch<React.SetStateAction<OrderCustomerSearchAddressState>>,
    addressEditCommonProps: AddressEditCommonProps
): OrderCustomerAddressEditProps => {
    if (variant === "shipping") {
        return {
            ...addressEditCommonProps,
            addressInputName: "shippingAddressInputOption",
            formErrors: dialogErrors.filter((error) => error.addressType === AddressTypeEnum.SHIPPING),
            onEdit: () =>
                setAddressSearchState({
                    open: true,
                    type: AddressTypeEnum.SHIPPING,
                }),
            onChangeAddressInputOption: change,
            addressInputOption: data.shippingAddressInputOption,
            selectedCustomerAddressId: data.customerShippingAddress?.id,
            formAddress: data.shippingAddress,
            formAddressCountryDisplayName: data.shippingCountryDisplayName,
            onChangeFormAddress: (event) => handlers.changeFormAddress(event, "shippingAddress"),
            onChangeFormAddressCountry: handlers.selectShippingCountry,
        };
    }
    return {
        ...addressEditCommonProps,
        addressInputName: "billingAddressInputOption",
        formErrors: dialogErrors.filter((error) => error.addressType === AddressTypeEnum.BILLING),
        onEdit: () =>
            setAddressSearchState({
                open: true,
                type: AddressTypeEnum.BILLING,
            }),
        onChangeAddressInputOption: change,
        addressInputOption: data.billingAddressInputOption,
        selectedCustomerAddressId: data.customerBillingAddress?.id,
        formAddress: data.billingAddress,
        formAddressCountryDisplayName: data.billingCountryDisplayName,
        onChangeFormAddress: (event) => handlers.changeFormAddress(event, "billingAddress"),
        onChangeFormAddressCountry: handlers.selectBillingCountry,
    };
};
