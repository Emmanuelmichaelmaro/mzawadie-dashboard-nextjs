// @ts-nocheck
import { GiftCardSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

import { GiftCardUrlSortField } from "../../types";

export const getSortQueryField = (sort: GiftCardUrlSortField): GiftCardSortField => {
    switch (sort) {
        case GiftCardUrlSortField.balance:
            return GiftCardSortField.CURRENT_BALANCE;
        case GiftCardUrlSortField.product:
            return GiftCardSortField.PRODUCT;
        case GiftCardUrlSortField.usedBy:
            return GiftCardSortField.USED_BY;
        default:
            return undefined;
    }
};

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
