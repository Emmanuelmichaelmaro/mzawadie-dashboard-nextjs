import { CategorySortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { CategoryListUrlSortField } from "@mzawadie/views/categories/urls";

export function getSortQueryField(sort: CategoryListUrlSortField): CategorySortField | undefined {
    switch (sort) {
        case CategoryListUrlSortField.name:
            return CategorySortField.NAME;
        case CategoryListUrlSortField.productCount:
            return CategorySortField.PRODUCT_COUNT;
        case CategoryListUrlSortField.subcategoryCount:
            return CategorySortField.SUBCATEGORY_COUNT;
        default:
            return undefined;
    }
}

// @ts-ignore
export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
