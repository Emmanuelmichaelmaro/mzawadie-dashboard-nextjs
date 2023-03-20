import { GiftCardErrorFragment, TimePeriodTypeEnum } from "@mzawadie/graphql";
import { FormChange } from "@mzawadie/hooks/useForm";

import { GiftCardExpiryType } from "../GiftCardCreateDialog/types";

export type GiftCardErrorKey =
    | "tags"
    | "expiryDate"
    | "currency"
    | "expiryPeriod"
    | "amount"
    | "balance"
    | "count";

export const giftCardBulkCreateErrorKeys: GiftCardErrorKey[] = [
    "tags",
    "expiryDate",
    "currency",
    "amount",
    "balance",
    "count",
];

export interface GiftCardBulkCreateFormDataInterface extends GiftCardCreateCommonFormData {
    cardsAmount: number;
}

export type GiftCardBulkCreateFormError = Pick<GiftCardErrorFragment, "code" | "field">;

export type GiftCardBulkCreateFormErrors = Partial<
    Record<GiftCardErrorKey, GiftCardBulkCreateFormError>
>;

export interface GiftCardBulkCreateFormCommonProps {
    change: FormChange;
    toggleValue: FormChange;
    errors: GiftCardBulkCreateFormErrors;
    data: GiftCardBulkCreateFormDataInterface;
}

export interface GiftCardCreateCommonFormData {
    expirySelected: boolean;
    expiryType: GiftCardExpiryType;
    expiryPeriodType: TimePeriodTypeEnum;
    expiryPeriodAmount: number;
    requiresActivation: boolean;
    tags: string[];
    balanceAmount: number;
    balanceCurrency: string;
    expiryDate: string;
}

export interface GiftCardBulkCreateFormData extends GiftCardCreateCommonFormData {
    cardsAmount: number;
}
