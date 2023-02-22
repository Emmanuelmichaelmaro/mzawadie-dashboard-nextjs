import { GiftCardError } from "@mzawadie/fragments/types/GiftCardError";
import { FormChange } from "@mzawadie/hooks/useForm";

import { GiftCardCreateFormData } from "./GiftCardCreateDialogForm";

export type GiftCardExpiryType = "EXPIRY_DATE" | "EXPIRY_PERIOD";

export interface GiftCardCreateFormCustomer {
    name: string;
    email: string;
}

export type GiftCardCreateCommonFormErrors = Record<
    "tags" | "expiryDate" | "currency" | "amount" | "balance",
    GiftCardError
>;

export type GiftCardCreateFormErrors = GiftCardCreateCommonFormErrors &
    Record<"customer", GiftCardError>;

export interface GiftCardCreateFormCommonProps {
    change: FormChange;
    toggleValue: FormChange;
    errors: GiftCardCreateFormErrors;
    data: GiftCardCreateFormData;
}
