import { Dialog } from "@mzawadie/core";

export enum GiftCardUpdatePageActionParamsEnum {
    SET_BALANCE = "set-balance",
}

export type GiftCardUpdatePageUrlQueryParams = Dialog<GiftCardUpdatePageActionParamsEnum>;
