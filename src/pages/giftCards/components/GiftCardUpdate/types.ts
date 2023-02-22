import { Dialog } from "@mzawadie/core";

export enum GiftCardUpdatePageActionParamsEnum {
    SET_BALANCE = "set-balance",
    DELETE = "delete",
    RESEND_CODE = "resend-code",
}

export type GiftCardUpdatePageUrlQueryParams = Dialog<GiftCardUpdatePageActionParamsEnum>;

export const PLACEHOLDER = "-";
