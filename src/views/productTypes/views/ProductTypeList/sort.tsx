/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-nocheck
import { ProductTypeSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { ProductTypeListUrlSortField } from "@mzawadie/views/productTypes/urls";

export function getSortQueryField(sort: ProductTypeListUrlSortField): ProductTypeSortField {
    switch (sort) {
        case ProductTypeListUrlSortField.name:
            return ProductTypeSortField.NAME;
        case ProductTypeListUrlSortField.digital:
            return ProductTypeSortField.DIGITAL;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
