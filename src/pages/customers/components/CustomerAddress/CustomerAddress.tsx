// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import { AddressFormatter } from "@mzawadie/components/AddressFormatter";
import { CardMenu } from "@mzawadie/components/CardMenu";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Skeleton from "@mzawadie/components/Skeleton";
import { AddressTypeEnum } from "@mzawadie/types/globalTypes";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";

export interface CustomerAddressProps {
    address: CustomerAddresses_user_addresses;
    disabled: boolean;
    isDefaultBillingAddress: boolean;
    isDefaultShippingAddress: boolean;
    addressNumber: number;
    onEdit: () => void;
    onRemove: () => void;
    onSetAsDefault: (type: AddressTypeEnum) => void;
}

const messages = defineMessages({
    defaultAddress: {
        defaultMessage: "Default Address",
        id: "hMRP6J",
    },
    defaultBillingAddress: {
        defaultMessage: "Default Billing Address",
        id: "VyzsWZ",
    },
    defaultShippingAddress: {
        defaultMessage: "Default Shipping Address",
        id: "nLML8Y",
    },
    deleteAddress: {
        defaultMessage: "Delete Address",
        id: "puikeb",
        description: "button",
    },
    editAddress: {
        defaultMessage: "Edit Address",
        id: "w+8BfK",
        description: "button",
    },
    setDefaultBilling: {
        defaultMessage: "Set as default billing address",
        id: "hLOEeb",
        description: "button",
    },
    setDefaultShipping: {
        defaultMessage: "Set as default shipping address",
        id: "+7OsyM",
        description: "button",
    },
});

const useStyles = makeStyles(
    {
        actions: {
            flexDirection: "row",
        },
        actionsContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "flex-end",
        },
        card: {
            display: "flex",
            flexDirection: "column",
        },
    },
    { name: "CustomerAddress" }
);
const CustomerAddress: React.FC<CustomerAddressProps> = (props) => {
    const {
        address,
        disabled,
        isDefaultBillingAddress,
        isDefaultShippingAddress,
        onEdit,
        onRemove,
        onSetAsDefault,
    } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card className={classes.card}>
            <CardTitle
                title={
                    address ? (
                        <>
                            {isDefaultBillingAddress && isDefaultShippingAddress
                                ? intl.formatMessage(messages.defaultAddress)
                                : isDefaultShippingAddress
                                ? intl.formatMessage(messages.defaultShippingAddress)
                                : isDefaultBillingAddress
                                ? intl.formatMessage(messages.defaultBillingAddress)
                                : null}
                        </>
                    ) : (
                        <Skeleton />
                    )
                }
                height="const"
                toolbar={
                    <CardMenu
                        disabled={disabled}
                        menuItems={[
                            {
                                label: intl.formatMessage(messages.setDefaultShipping),
                                onSelect: () => onSetAsDefault(AddressTypeEnum.SHIPPING),
                                testId: "set-default-shipping-address",
                            },
                            {
                                label: intl.formatMessage(messages.setDefaultBilling),
                                onSelect: () => onSetAsDefault(AddressTypeEnum.BILLING),
                                testId: "set-default-billing-address",
                            },
                            {
                                label: intl.formatMessage(messages.editAddress),
                                onSelect: () => onEdit(),
                                testId: "edit-address",
                            },
                            {
                                label: intl.formatMessage(messages.deleteAddress),
                                onSelect: () => onRemove(),
                                testId: "delete-address",
                            },
                        ]}
                    />
                }
            />

            <CardContent>
                <AddressFormatter address={address} />
            </CardContent>
        </Card>
    );
};

CustomerAddress.displayName = "CustomerAddress";

export default CustomerAddress;
