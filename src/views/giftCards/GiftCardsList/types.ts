import { Dialog, Pagination } from "@mzawadie/core";

export type GiftCardListColumns = "giftCardCode" | "tag" | "balance" | "usedBy" | "product";

export enum GiftCardListActionParamsEnum {
    CREATE = "gift-card-create",
}

export type GiftCardListUrlQueryParams = Pagination & Dialog<GiftCardListActionParamsEnum>;
