// @ts-nocheck
import { useExitFormDialog } from "@mzawadie/components/Form/useExitFormDialog";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { AddressFragment, CountryWithCodeFragment } from "@mzawadie/graphql";
import useForm, {
    CommonUseFormResultWithHandlers,
    FormChange,
    SubmitPromise,
} from "@mzawadie/hooks/useForm";
import useHandleFormSubmit from "@mzawadie/hooks/useHandleFormSubmit";
import { AddressTypeInput } from "@mzawadie/pages/customers/types";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import React, { useEffect, useState } from "react";

export enum AddressInputOptionEnum {
    CUSTOMER_ADDRESS = "customerAddress",
    NEW_ADDRESS = "newAddress",
}

export interface OrderCustomerAddressesEditFormData {
    cloneAddress: boolean;
    shippingAddressInputOption: AddressInputOptionEnum;
    billingAddressInputOption: AddressInputOptionEnum;
    customerShippingAddress: Node;
    customerBillingAddress: Node;
    shippingAddress: AddressTypeInput;
    billingAddress: AddressTypeInput;
}

export interface OrderCustomerAddressesEditData extends OrderCustomerAddressesEditFormData {
    shippingCountryDisplayName: string;
    billingCountryDisplayName: string;
}

export interface OrderCustomerAddressesEditHandlers {
    changeFormAddress: (
        event: React.ChangeEvent<any>,
        addressType: "shippingAddress" | "billingAddress"
    ) => void;
    changeCustomerAddress: (
        customerAddress: AddressFragment,
        addressType: "customerShippingAddress" | "customerBillingAddress"
    ) => void;
    selectShippingCountry: FormChange;
    selectBillingCountry: FormChange;
}

interface UseOrderCustomerAddressesEditFormResult
    extends CommonUseFormResultWithHandlers<
        OrderCustomerAddressesEditData,
        OrderCustomerAddressesEditHandlers
    > {
    submit: (event: React.FormEvent<any>) => SubmitPromise<any[]>;
}

interface UseOrderCustomerAddressesEditFormOpts {
    countryChoices: SingleAutocompleteChoiceType[];
    countries: CountryWithCodeFragment[];
    defaultShippingAddress: Node;
    defaultBillingAddress: Node;
    defaultCloneAddress: boolean;
}

export interface OrderCustomerAddressesEditFormProps extends UseOrderCustomerAddressesEditFormOpts {
    children: (props: UseOrderCustomerAddressesEditFormResult) => React.ReactNode;
    initial?: Partial<OrderCustomerAddressesEditFormData>;
    onSubmit: (data: OrderCustomerAddressesEditData) => void;
}

function useOrderCustomerAddressesEditForm(
    providedInitialFormData: Partial<OrderCustomerAddressesEditFormData>,
    onSubmit: (data: OrderCustomerAddressesEditData) => void,
    opts: UseOrderCustomerAddressesEditFormOpts
): UseOrderCustomerAddressesEditFormResult {
    const emptyAddress: AddressTypeInput = {
        city: "",
        country: "",
        phone: "",
        postalCode: "",
        streetAddress1: "",
    };
    const defaultInitialFormData: OrderCustomerAddressesEditFormData = {
        cloneAddress: opts.defaultCloneAddress,
        shippingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
        billingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
        customerShippingAddress: opts.defaultShippingAddress,
        customerBillingAddress: opts.defaultBillingAddress,
        shippingAddress: emptyAddress,
        billingAddress: emptyAddress,
    };

    const initialData = {
        ...defaultInitialFormData,
        ...providedInitialFormData,
    };

    const {
        handleChange,
        hasChanged,
        change,
        data: formData,
        setChanged,
    } = useForm({
        ...initialData,
    });

    const { setExitDialogSubmitRef } = useExitFormDialog();

    const [shippingCountryDisplayName, setShippingCountryDisplayName] = useState(
        opts.countries.find((country) => initialData.shippingAddress.country === country.code)?.country
    );
    const [billingCountryDisplayName, setBillingCountryDisplayName] = useState(
        opts.countries.find((country) => initialData.billingAddress.country === country.code)?.country
    );

    const handleFormAddressChange = (
        event: React.ChangeEvent<any>,
        addressType: "shippingAddress" | "billingAddress"
    ) =>
        change({
            target: {
                name: addressType,
                value: {
                    ...formData[addressType],
                    [event.target.name]: event.target.value,
                },
            },
        });
    const handleCustomerAddressChange = (
        customerAddress: AddressFragment,
        addressType: "customerShippingAddress" | "customerBillingAddress"
    ) =>
        change({
            target: {
                name: addressType,
                value: customerAddress,
            },
        });
    const handleShippingCountrySelect = createSingleAutocompleteSelectHandler(
        (event) =>
            change({
                target: {
                    name: "shippingAddress",
                    value: {
                        ...formData.shippingAddress,
                        [event.target.name]: event.target.value,
                    },
                },
            }),
        setShippingCountryDisplayName,
        opts.countryChoices
    );
    const handleBillingCountrySelect = createSingleAutocompleteSelectHandler(
        (event) =>
            change({
                target: {
                    name: "billingAddress",
                    value: {
                        ...formData.billingAddress,
                        [event.target.name]: event.target.value,
                    },
                },
            }),
        setBillingCountryDisplayName,
        opts.countryChoices
    );

    const data = {
        ...formData,
        shippingCountryDisplayName,
        billingCountryDisplayName,
    };

    const handleFormSubmit = useHandleFormSubmit({
        onSubmit,
        setChanged,
    });

    const handleSubmit = () => handleFormSubmit(data);

    const submit = (event: React.FormEvent<any>) => {
        event.stopPropagation();
        event.preventDefault();
        return handleSubmit();
    };

    useEffect(() => setExitDialogSubmitRef(submit), [handleSubmit]);

    return {
        change: handleChange,
        submit,
        hasChanged,
        data,
        handlers: {
            changeCustomerAddress: handleCustomerAddressChange,
            changeFormAddress: handleFormAddressChange,
            selectShippingCountry: handleShippingCountrySelect,
            selectBillingCountry: handleBillingCountrySelect,
        },
    };
}

const OrderCustomerAddressesEditForm: React.FC<OrderCustomerAddressesEditFormProps> = ({
    children,
    initial,
    onSubmit,
    ...rest
}) => {
    const props = useOrderCustomerAddressesEditForm(initial || {}, onSubmit, rest);

    return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderCustomerAddressesEditForm.displayName = "OrderCustomerAddressesEditForm";
export default OrderCustomerAddressesEditForm;
