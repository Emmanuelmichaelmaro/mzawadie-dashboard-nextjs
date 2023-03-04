import { defineMessages } from "react-intl";

export const dialogMessages = defineMessages({
    customerChangeTitle: {
        defaultMessage: "Change address for order",
        id: "PBd/e+",
        description: "dialog header",
    },
    shippingChangeTitle: {
        defaultMessage: "Change customer shipping address",
        id: "129wyQ",
        description: "dialog header",
    },
    billingChangeTitle: {
        defaultMessage: "Change customer billing address",
        id: "D4W/LE",
        description: "dialog header",
    },
    billingSameAsShipping: {
        defaultMessage: "Set the same for billing address",
        id: "RzDYi8",
        description: "checkbox label",
    },
    shippingSameAsBilling: {
        defaultMessage: "Set the same for shipping address",
        id: "txOXvy",
        description: "checkbox label",
    },
    addressChangeDescription: {
        defaultMessage: "Select method you want to use to change address",
        id: "FIZvTx",
        description: "dialog content",
    },
    noAddressDescription: {
        defaultMessage:
            "This customer doesn't have any addresses in the address book. Provide address for order:",
        id: "xWEFrR",
        description: "dialog content",
    },
    customerChangeDescription: {
        defaultMessage:
            "Which address would you like to use as shipping address for selected customer:",
        id: "CG+awx",
        description: "dialog content",
    },
    customerChangeBillingDescription: {
        defaultMessage: "Select one of customer addresses or add a new address:",
        id: "qov29K",
        description: "dialog content",
    },
    noAddressBillingDescription: {
        defaultMessage: "Add a new address:",
        id: "Qph0GE",
        description: "dialog content",
    },
    shippingTitle: {
        defaultMessage: "Shipping address",
        id: "2OH46U",
        description: "search modal shipping title",
    },
    billingTitle: {
        defaultMessage: "Billing address",
        id: "r4g/vD",
        description: "search modal billing title",
    },
    searchInfo: {
        defaultMessage: "Select an address you want to use from the list below",
        id: "zqarUF",
        description: "modal information under title",
    },
    noResultsFound: {
        defaultMessage: "No results found",
        id: "kQq6/o",
        description: "info when addresses search is unsuccessful",
    },
});

export const addressEditMessages = defineMessages({
    customerAddress: {
        defaultMessage: "Use one of customer addresses",
        id: "vf56In",
        description: "address type",
    },
    newAddress: {
        defaultMessage: "Add new address",
        id: "9gb9b4",
        description: "address type",
    },
});
