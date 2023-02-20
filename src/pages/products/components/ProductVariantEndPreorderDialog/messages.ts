import { defineMessages } from "react-intl";

export const productVariantEndPreorderDialogMessages = defineMessages({
    dialogTitle: {
        defaultMessage: "Ending preorder",
        id: "Y4cy0i",
        description: "dialog header",
    },
    dialogMessage: {
        defaultMessage:
            "You are about to end your products preorder. You have sold {variantGlobalSoldUnits} units of this variant. Sold units will be allocated at appropriate warehouses. Remember to add remaining threshold stock to warehouses.",
        id: "dTCWqt",
    },
    dialogConfirmButtonLabel: {
        defaultMessage: "ACCEPT",
        id: "XMvH/d",
        description: "button label",
    },
});
