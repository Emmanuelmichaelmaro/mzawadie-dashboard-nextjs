import { defineMessages } from "react-intl";

export const giftCardsListHeaderMenuItemsMessages = defineMessages({
    settings: {
        defaultMessage: "Settings",
        id: "F69lwk",
        description: "settings menu item",
    },
    bulkIssue: {
        defaultMessage: "Bulk Issue",
        id: "9hab/1",
        description: "bulk issue menu item",
    },
    exportCodes: {
        defaultMessage: "Export card codes",
        id: "exvX+Z",
        description: "export card codes menu item",
    },
    issueButtonLabel: {
        defaultMessage: "Issue card",
        id: "RfPJ1E",
        description: "issue card button label",
    },
    noGiftCardsAlertTitle: {
        defaultMessage: "You haven’t defined a gift card product!",
        id: "4Mlvlw",
        description: "no card defined alert message",
    },
    noGiftCardsProductsAndProductTypes: {
        defaultMessage:
            "{createGiftCardProductType} and {giftCardProduct} to start selling gift cards in your store.",
        id: "U9o2bV",
        description: "no gift card products and types alert message",
    },
    noGiftCardsProductTypes: {
        defaultMessage: "{createGiftCardProductType} to start selling gift cards in your store.",
        id: "VI+X8H",
        description: "no gift card product types alert message",
    },
    noGiftCardsProducts: {
        defaultMessage: "{createGiftCardProduct} to start selling gift cards in your store.",
        id: "jmh0rV",
        description: "no gift card products alert message",
    },
    createGiftCardProductType: {
        defaultMessage: "Create a gift card product type",
        id: "8Hq18g",
        description: "create gift card product type alert message",
    },
    createGiftCardProduct: {
        defaultMessage: "Create a gift card product",
        id: "HqeqEV",
        description: "create gift card product alert message",
    },
    giftCardProduct: {
        defaultMessage: "gift card product",
        id: "AJgl5u",
        description: "gift card product message",
    },
});

export const giftCardsListTableMessages = defineMessages({
    giftCardsTableColumnGiftCardTitle: {
        defaultMessage: "Gift Card",
        id: "eLJQSh",
        description: "column title gift card",
    },
    giftCardsTableColumnTagTitle: {
        defaultMessage: "Tag",
        id: "FEWgh/",
        description: "column title tag",
    },
    giftCardsTableColumnProductTitle: {
        defaultMessage: "Product",
        id: "bwJc6V",
        description: "column title product",
    },
    giftCardsTableColumnCustomerTitle: {
        defaultMessage: "Used by",
        id: "MJBAqv",
        description: "column title used by/customer",
    },
    giftCardsTableColumnBalanceTitle: {
        defaultMessage: "Balance",
        id: "MbZHXE",
        description: "column title balance",
    },
    codeEndingWithLabel: {
        defaultMessage: "Code ending with {last4CodeChars}",
        id: "38dS1A",
        description: "code ending with label",
    },
    noGiftCardsFound: {
        defaultMessage: "No gift cards found",
        id: "Rd0s80",
        description: "no cards found title message",
    },
});

export const giftCardUpdateFormMessages = defineMessages({
    giftCardInvalidExpiryDateHeader: {
        defaultMessage: "Incorrect date entered",
        id: "4ZsK2g",
        description: "invalid date in expiry-date field header",
    },
    giftCardInvalidExpiryDateContent: {
        defaultMessage: "Gift Card with past expiration date cannot be created",
        id: "KDHuux",
        description: "invalid date in expiry-date field content",
    },
});
