import { defineMessages } from "react-intl";

import { ValidationErrorCode } from "./types";

export const validationMessages = defineMessages<ValidationErrorCode>({
    VALUE_REQUIRED: {
        defaultMessage: "Choose a value",
        id: "XkX56I",
        description: "filters error messages value required",
    },
    DEPENDENCIES_MISSING: {
        defaultMessage: "Filter requires other filters: {dependencies}",
        id: "erC44f",
        description: "filters error messages dependencies missing",
    },
    UNKNOWN_ERROR: {
        defaultMessage: "Unknown error occurred",
        id: "USS3Q7",
        description: "filters error messages unknown error",
    },
});
