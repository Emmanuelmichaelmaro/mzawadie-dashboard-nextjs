// @ts-nocheck
import { Typography } from "@material-ui/core";
import { Container } from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { getStringOrPlaceholder, renderCollection } from "@mzawadie/core";
import { AddressTypeEnum, CustomerDetailsFragment } from "@mzawadie/graphql";
import { Backlink, Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { CustomerAddress } from "../CustomerAddress";

export interface CustomerAddressListPageProps {
    customer: CustomerDetailsFragment;
    disabled: boolean;
    onAdd: () => void;
    onBack: () => void;
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
    onSetAsDefault: (id: string, type: AddressTypeEnum) => void;
}

const messages = defineMessages({
    addAddress: {
        defaultMessage: "Add address",
        id: "rjy9/k",
        description: "button",
    },
    doesntHaveAddresses: {
        defaultMessage:
            "This customer doesn’t have any adresses added to his address book. You can add address using the button below.",
        id: "kErneR",
    },
    fullNameAddress: {
        defaultMessage: "{fullName}'s Address Book",
        id: "n5vskv",
        description: "customer's address book, header",
    },
    noNameToShow: {
        defaultMessage: "Address Book",
        id: "CWqmRU",
        description: "customer's address book when no customer name is available, header",
    },
    fullNameDetail: {
        defaultMessage: "{fullName} Details",
        id: "MpR4zK",
        description: "customer details, header",
    },
    noAddressToShow: {
        defaultMessage: "There is no address to show for this customer",
        id: "y/UWBR",
    },
});

const useStyles = makeStyles(
    (theme) => ({
        addButton: {
            marginTop: theme.spacing(2),
        },
        description: {
            marginTop: theme.spacing(1),
        },
        empty: {
            margin: `${theme.spacing(13)}px auto 0`,
            textAlign: "center",
            width: 600,
        },
        root: {
            display: "grid",
            gap: theme.spacing(3),
            gridTemplateColumns: "repeat(3, 1fr)",
            [theme.breakpoints.down("md")]: {
                gridTemplateColumns: "repeat(2, 1fr)",
            },
            [theme.breakpoints.down("sm")]: {
                gridTemplateColumns: "repeat(1, 1fr)",
            },
        },
    }),
    { name: "CustomerAddressListPage" }
);

const CustomerAddressListPage: React.FC<CustomerAddressListPageProps> = (props) => {
    const { customer, disabled, onAdd, onBack, onEdit, onRemove, onSetAsDefault } = props;

    const classes = useStyles(props);

    const intl = useIntl();

    const isEmpty = customer?.addresses?.length === 0;

    const fullName = getStringOrPlaceholder(
        customer && [customer.firstName, customer.lastName].join(" ")
    );

    return (
        <Container>
            <Backlink onClick={onBack}>
                {fullName.trim().length > 0
                    ? intl.formatMessage(messages.fullNameDetail, { fullName })
                    : intl.formatMessage(messages.noNameToShow)}
            </Backlink>

            {!isEmpty && (
                <PageHeader
                    title={
                        fullName.trim().length > 0
                            ? intl.formatMessage(messages.fullNameAddress, { fullName })
                            : intl.formatMessage(messages.noNameToShow)
                    }
                >
                    <Button variant="primary" onClick={onAdd} data-test-id="add-address">
                        {intl.formatMessage(messages.addAddress)}
                    </Button>
                </PageHeader>
            )}

            {isEmpty ? (
                <div className={classes.empty}>
                    <Typography variant="h5">{intl.formatMessage(messages.noAddressToShow)}</Typography>
                    <Typography className={classes.description}>
                        {intl.formatMessage(messages.doesntHaveAddresses)}
                    </Typography>
                    <Button className={classes.addButton} variant="primary" onClick={onAdd}>
                        {intl.formatMessage(messages.addAddress)}
                    </Button>
                </div>
            ) : (
                <div className={classes.root}>
                    {renderCollection(customer?.addresses, (address, addressNumber) => (
                        <CustomerAddress
                            address={address}
                            addressNumber={addressNumber + 1}
                            disabled={disabled}
                            isDefaultBillingAddress={
                                customer?.defaultBillingAddress?.id === address?.id
                            }
                            isDefaultShippingAddress={
                                customer?.defaultShippingAddress?.id === address?.id
                            }
                            onEdit={() => onEdit(address.id)}
                            onRemove={() => onRemove(address.id)}
                            onSetAsDefault={(type) => onSetAsDefault(address.id, type)}
                            key={address?.id || "skeleton"}
                        />
                    ))}
                </div>
            )}
        </Container>
    );
};

CustomerAddressListPage.displayName = "CustomerAddressListPage";

export default CustomerAddressListPage;
