import { defineMessages } from "react-intl";

const giftCardHistoryMessages = defineMessages({
    noteAddedSuccessfully: {
        defaultMessage: "Note was added sucessfully",
        id: "WS4ov0",
        description: "notifier message",
    },
    noteAddError: {
        defaultMessage: "There was an error adding a note",
        id: "JgNb8X",
        description: "notifier message",
    },
    historyHeaderTitle: {
        defaultMessage: "Gift Card Timeline",
        id: "4Z0O2B",
        description: "section header title",
    },
});

const giftCardHistoryTimelineMessages = defineMessages({
    activated: {
        defaultMessage: "Gift card was activated by {activatedBy}",
        id: "fExm0/",
        description: "gift card history message",
    },
    activatedAnonymous: {
        defaultMessage: "Gift card was activated",
        id: "pCy5EP",
        description: "gift card history message",
    },
    balanceReset: {
        defaultMessage: "Gift card balance was reset by {resetBy}",
        id: "aEc9Ar",
        description: "gift card history message",
    },
    balanceResetAnonymous: {
        defaultMessage: "Gift card balance was reset by {resetBy}",
        id: "aEc9Ar",
        description: "gift card history message",
    },
    bought: {
        defaultMessage: "Gift card was bought in order {orderNumber}",
        id: "PcQRxi",
        description: "gift card history message",
    },
    deactivated: {
        defaultMessage: "Gift card was deactivated by {deactivatedBy}",
        id: "gAqkrG",
        description: "gift card history message",
    },
    deactivatedAnonymous: {
        defaultMessage: "Gift card was deactivated",
        id: "NvwS/N",
        description: "gift card history message",
    },
    expiryDateUpdate: {
        defaultMessage: "Gift card expiry date was updated by {expiryUpdatedBy}",
        id: "vQunFc",
        description: "gift card history message",
    },
    expiryDateUpdateAnonymous: {
        defaultMessage: "Gift card expiry date was updated",
        id: "fLhj3a",
        description: "gift card history message",
    },
    issued: {
        defaultMessage: "Gift card was issued by {issuedBy}",
        id: "30X9S8",
        description: "gift card history message",
    },
    issuedAnonymous: {
        defaultMessage: "Gift card was issued",
        id: "jDovoJ",
        description: "gift card history message",
    },
    resent: {
        defaultMessage: "Gift card was resent",
        id: "gj3MUg",
        description: "gift card history message",
    },
    sentToCustomer: {
        defaultMessage: "Gift card was sent to customer",
        id: "tsL3IW",
        description: "gift card history message",
    },
    tagsUpdated: {
        defaultMessage: "Gift card tags were updated",
        id: "vkAWwY",
        description: "gift card history message",
    },
    usedInOrder: {
        defaultMessage: "Gift card was used as a payment method on order {orderLink} <buyer>by</buyer>",
        id: "Uu2B2G",
        description: "gift card history message",
    },
    usedInOrderAnonymous: {
        defaultMessage: "Gift card was used as a payment method on order {orderLink}",
        id: "408KSO",
        description: "gift card history message",
    },
});

export { giftCardHistoryMessages, giftCardHistoryTimelineMessages };
