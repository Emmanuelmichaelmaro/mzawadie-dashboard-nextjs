// @ts-nocheck
import { OrderSortField } from "@mzawadie/graphql";
import { OrderListUrlSortField } from "@mzawadie/pages/orders/urls";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export const DEFAULT_SORT_KEY = OrderListUrlSortField.number;

export function getSortQueryField(sort: OrderListUrlSortField): OrderSortField {
    switch (sort) {
        case OrderListUrlSortField.number:
            return OrderSortField.NUMBER;
        case OrderListUrlSortField.date:
            return OrderSortField.CREATION_DATE;
        case OrderListUrlSortField.customer:
            return OrderSortField.CUSTOMER;
        case OrderListUrlSortField.fulfillment:
            return OrderSortField.FULFILLMENT_STATUS;
        case OrderListUrlSortField.payment:
            return OrderSortField.PAYMENT;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
