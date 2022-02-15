import { defineMessages } from "react-intl";

export const baseMessages = defineMessages({
    title: {
        defaultMessage: "Delete product {selectedTypesCount,plural,one{type} other{types}}",
        id: "x3leH4",
        description: "ProductTypeDeleteWarningDialog title",
    },
    viewAssignedItemsButtonLabel: {
        defaultMessage: "View products",
        id: "GCPzKf",
        description: "ProductTypeDeleteWarningDialog single assigned items button label",
    },
});

export const singleWithItemsMessages = defineMessages({
    description: {
        defaultMessage:
            "You are about to delete product type <b>{typeName}</b>. It is assigned to {assignedItemsCount} {assignedItemsCount,plural,one{product} other{products}}. Deleting this product type will also delete those products. Are you sure you want to do this?",
        description: "ProductTypeDeleteWarningDialog single assigned items description",
        id: "ZFfG4L",
    },
    consentLabel: {
        defaultMessage: "Yes, I want to delete this product type and assigned products",
        description: "ProductTypeDeleteWarningDialog single consent label",
        id: "bk9KUX",
    },
});

export const multipleWithItemsMessages = defineMessages({
    description: {
        defaultMessage:
            "You are about to delete multiple product types. Some of them are assigned to products. Deleting those product types will also delete those products",
        description: "ProductTypeDeleteWarningDialog with items multiple description",
        id: "3dVKNR",
    },
    consentLabel: {
        defaultMessage: "Yes, I want to delete those products types and assigned products",
        description: "ProductTypeDeleteWarningDialog multiple consent label",
        id: "0em8tI",
    },
});

export const singleWithoutItemsMessages = defineMessages({
    description: {
        defaultMessage:
            "Are you sure you want to delete <b>{typeName}</b>? If you remove it you won’t be able to assign it to created products.",
        description: "ProductTypeDeleteWarningDialog single no assigned items description",
        id: "HivFnX",
    },
});

export const multipleWithoutItemsMessages = defineMessages({
    description: {
        defaultMessage:
            "Are you sure you want to delete selected product types? If you remove them you won’t be able to assign them to created products.",
        description: "ProductTypeDeleteWarningDialog multiple assigned items description",
        id: "aPqizA",
    },
});
