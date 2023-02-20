// @ts-nocheck
import { CollectionListUrlSortField } from "@mzawadie/pages/collections/urls";
import { CollectionSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export const DEFAULT_SORT_KEY = CollectionListUrlSortField.name;

export function canBeSorted(sort: CollectionListUrlSortField, isChannelSelected: boolean) {
    switch (sort) {
        case CollectionListUrlSortField.name:
        case CollectionListUrlSortField.productCount:
            return true;
        case CollectionListUrlSortField.available:
            return isChannelSelected;
        default:
            return false;
    }
}

export function getSortQueryField(sort: CollectionListUrlSortField): CollectionSortField | undefined {
    switch (sort) {
        case CollectionListUrlSortField.name:
            return CollectionSortField.NAME;
        case CollectionListUrlSortField.available:
            return CollectionSortField.AVAILABILITY;
        case CollectionListUrlSortField.productCount:
            return CollectionSortField.PRODUCT_COUNT;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
