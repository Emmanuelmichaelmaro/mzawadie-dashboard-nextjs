import { defineMessages } from "react-intl";

export const giftCardDeleteDialogMessages = defineMessages({
    title: {
        defaultMessage: "{selectedItemsCount,plural,one{Delete Gift Card} other{Delete Gift Cards}}",
        id: "a+iRI1",
        description: "single gift card title",
    },
    defaultDescription: {
        defaultMessage:
            "{selectedItemsCount,plural,one{Are you sure you want to delete this gift card?} other{Are you sure you want to delete {selectedItemsCount} giftCards?}}",
        id: "S52JMl",
        description: "default gift card delete description",
    },
    withBalanceDescription: {
        defaultMessage:
            "{selectedItemsCount,plural,one{The gift card you are about to delete has available balance. By deleting this card you may remove balance available to your customer.} other{You are about to delete gift cards with available balance. Are you sure you want to do that?}}",
        id: "RLZ1jd",
        description: "delete gift cards with balance description",
    },
    consentLabel: {
        defaultMessage:
            "{selectedItemsCount,plural,one{I am aware that I am removing a gift card with balance} other{I am aware that I am removing gift cards with balance}}",
        id: "Yxihwg",
        description: "consent removal of gift cards with balance button label",
    },
    deleteSuccessAlertText: {
        defaultMessage:
            "{selectedItemsCount,plural,one{Successfully deleted gift card} other{Successfully deleted gift cards}}",
        id: "zLtb4N",
        description: "gift card removed success alert message",
    },
});
