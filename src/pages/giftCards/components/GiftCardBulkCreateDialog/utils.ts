// @ts-nocheck
import { GiftCardError } from "@mzawadie/fragments/types/GiftCardError";
import { GiftCardErrorCode } from "@mzawadie/types/globalTypes";
import reduce from "lodash/reduce";

import { GiftCardBulkCreateFormData, GiftCardBulkCreateFormErrors } from "./types";

export const validateField = (
    {
        expiryDate,
        expiryPeriodAmount,
        expiryType,
        expirySelected,
        expiryPeriodType,
    }: GiftCardBulkCreateFormData,
    value,
    key: keyof GiftCardBulkCreateFormData
): Pick<GiftCardError, "field" | "code"> | null => {
    const error = { code: GiftCardErrorCode.INVALID, field: key };
    const expiryDateSelected = expirySelected && expiryType === "EXPIRY_DATE";
    const expiryPeriodSelected = expirySelected && expiryType === "EXPIRY_PERIOD";

    switch (key) {
        case "cardsAmount":
        case "tags":
        case "balanceCurrency":
        case "balanceAmount":
            return !value ? error : null;

        case "expiryDate":
            return expiryDateSelected && !expiryDate ? error : null;

        case "expiryPeriodAmount":
            return expiryPeriodSelected && (!expiryPeriodType || !expiryPeriodAmount)
                ? { ...error, field: "expiryDate" }
                : null;
    }
};

export const validateForm = (formData: GiftCardBulkCreateFormData): GiftCardBulkCreateFormErrors =>
    reduce(
        formData,
        (resultErrors, value, key: keyof GiftCardBulkCreateFormData) => {
            const correspondingKeys = {
                cardsAmount: "count",
                balanceCurrency: "balance",
                balanceAmount: "balance",
                expiryPeriodAmount: "expiryDate",
            };

            const formError = validateField(formData, value, key);

            if (!formError) {
                return resultErrors;
            }

            return { ...resultErrors, [correspondingKeys[key] || key]: formError };
        },
        {}
    );
