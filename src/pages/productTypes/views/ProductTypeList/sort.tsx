/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-nocheck
import { ProductTypeListUrlSortField } from "@mzawadie/pages/productTypes/urls";
import { ProductTypeSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

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
