import { CategorySortField } from "@mzawadie/graphql";
import { CategoryListUrlSortField } from "@mzawadie/pages/categories/urls";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

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
