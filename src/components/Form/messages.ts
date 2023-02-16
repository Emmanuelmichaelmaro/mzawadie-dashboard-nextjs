import { defineMessages } from "react-intl";

export const exitFormPromptMessages = defineMessages({
    title: {
        defaultMessage: "Are you sure you want to leave?",
        id: "3JAOk9",
        description: "ExitFormPrompt title",
    },
    description: {
        defaultMessage: "You have unsaved changes on this view. What would you like to do with them?",
        id: "S/TQBw",
        description: "ExitFormPrompt description",
    },
    cancelButton: {
        defaultMessage: "leave without saving",
        id: "Ol1vso",
        description: "ExitFormPrompt cancel button",
    },
    confirmButton: {
        defaultMessage: "save & continue",
        id: "ijl+4z",
        description: "ExitFormPrompt confirm button",
    },
});
