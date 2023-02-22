import { defineMessages } from "react-intl";

export const giftCardResendCodeDialogMessages = defineMessages({
    title: {
        defaultMessage: "Resend code to customer",
        id: "mslSpp",
        description: "resend code to customer title",
    },
    description: {
        defaultMessage:
            "Gift Card Code will be resent to email provided during checkout. You can provide a different email address if you want to:",
        id: "ttk0w7",
        description: "resend code to customer description",
    },
    consentCheckboxLabel: {
        defaultMessage: "Yes, I want to send gift card to different address",
        id: "v01/tY",
        description: "consent to send gift card to different address checkbox label",
    },
    submitButtonLabel: {
        defaultMessage: "Resend",
        id: "s1IQuN",
        description: "resend button label",
    },
    emailInputPlaceholder: {
        defaultMessage: "Provided email address",
        id: "AqHafs",
        description: "provided email input placeholder",
    },
    successResendAlertText: {
        defaultMessage: "Successfully resent code to customer!",
        id: "JQH+Iy",
        description: "resent code success message",
    },
    sendToChannelSelectLabel: {
        defaultMessage: "Send to channel",
        id: "NLNonj",
        description: "send to channel select label",
    },
});
