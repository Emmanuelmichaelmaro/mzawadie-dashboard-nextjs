import { defineMessages } from "react-intl";

export const bulkEnableDisableSectionMessages = defineMessages({
    enableLabel: {
        defaultMessage: "Activate",
        id: "hz+9ES",
        description: "bulk activate label",
    },
    disableLabel: {
        defaultMessage: "Deactivate",
        id: "IzEVek",
        description: "bulk disable label",
    },
    deleteLabel: {
        defaultMessage: "Delete",
        id: "qkt/Km",
        description: "bulk delete label",
    },
    successActivateAlertText: {
        defaultMessage: "Successfully activated gift {count,plural,one{card} other{cards}}",
        id: "IwEQvz",
        description: "success activate alert message",
    },
    successDeactivateAlertText: {
        defaultMessage: "Successfully deactivated gift {count,plural,one{card} other{cards}}",
        id: "SO56cv",
        description: "success deactivate alert message",
    },
    errorActivateAlertText: {
        defaultMessage: "Error activating gift {count,plural,one{card} other{cards}}",
        id: "KxeLH7",
        description: "error with activation alert message",
    },
    errorDeactivateAlertText: {
        defaultMessage: "Errors deactivating gift {count,plural,one{card} other{cards}}",
        id: "I1plRp",
        description: "error with deactivation alert message",
    },
});
