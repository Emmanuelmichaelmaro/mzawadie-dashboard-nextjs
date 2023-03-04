// @ts-nocheck
import { OrderDraftListUrlSortField } from "@mzawadie/pages/orders/urls";
import { OrderSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: OrderDraftListUrlSortField): OrderSortField {
    switch (sort) {
        case OrderDraftListUrlSortField.number:
            return OrderSortField.NUMBER;
        case OrderDraftListUrlSortField.date:
            return OrderSortField.CREATION_DATE;
        case OrderDraftListUrlSortField.customer:
            return OrderSortField.CUSTOMER;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
