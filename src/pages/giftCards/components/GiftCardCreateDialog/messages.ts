import { defineMessages } from "react-intl";

export const giftCardCreateMessages = defineMessages({
    title: {
        defaultMessage: "Issue gift card",
        id: "JftRtx",
        description: "issue gift card dialog title",
    },
    amountLabel: {
        defaultMessage: "Enter amount",
        id: "n9JOI3",
        description: "money amount input label",
    },
    issueButtonLabel: {
        defaultMessage: "Issue",
        id: "PilTI6",
        description: "issue gift card button label",
    },
    customerLabel: {
        defaultMessage: "Customer",
        id: "MgdgpT",
        description: "customer input label",
    },
    noteLabel: {
        defaultMessage: "Note",
        id: "UKgP89",
        description: "note input label",
    },
    noteSubtitle: {
        defaultMessage:
            "Why was this gift card issued. This note will not be shown to the customer. Note will be stored in gift card history",
        id: "ZuqkSp",
        description: "note input subtitle",
    },
    createdGiftCardLabel: {
        defaultMessage: "This is the code of a created gift card:",
        id: "zjZuhM",
        description: "created gift card code label",
    },
    copyCodeLabel: {
        defaultMessage: "Copy code",
        id: "RXbkle",
        description: "copy code button label",
    },
    copiedToClipboardTitle: {
        defaultMessage: "Copied to clipboard",
        id: "hnBvH7",
        description: "copied to clipboard alert title",
    },
    createdSuccessAlertTitle: {
        defaultMessage: "Successfully created gift card",
        id: "WzHfj8",
        description: "successfully created gift card alert title",
    },
    requiresActivationLabel: {
        defaultMessage: "Requires activation",
        id: "vCw7BP",
        description: "requires activation checkbox label",
    },
    requiresActivationCaption: {
        defaultMessage: "All issued cards require activation by staff before use.",
        id: "ArctEg",
        description: "requires activation checkbox caption",
    },
    giftCardsAmountLabel: {
        defaultMessage: "Cards Issued",
        id: "uilt7q",
        description: "issued cards amount label",
    },
    bulkCreateExplanation: {
        defaultMessage:
            "After creation Saleor will create a list of gift card codes that you will be able to download. ",
        id: "45aV8u",
        description: "gift card bulk create modal bottom explanation",
    },
    bulkCreateIssuedTitle: {
        defaultMessage: "Bulk Issue Gift Cards",
        id: "WyPitj",
        description: "gift card bulk create success dialog title",
    },
    bulkCreateIssuedExplanation: {
        defaultMessage:
            "We have issued all of your requested gift cards. You can download the list of new gift cards using the button below.",
        id: "NZtcLb",
        description: "gift card bulk create success dialog content",
    },
    bulkCreateIssuedAccept: {
        defaultMessage: "Ok",
        id: "vDnheO",
        description: "gift card bulk create success dialog accept button",
    },
    bulkCreateIssuedExportToEmail: {
        defaultMessage: "Export To Email",
        id: "IVOjqW",
        description: "gift card bulk create success dialog export button",
    },
});
