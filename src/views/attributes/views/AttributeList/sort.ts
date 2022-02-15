import { AttributeSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { AttributeListUrlSortField } from "@mzawadie/views/attributes/urls";

export function getSortQueryField(sort: AttributeListUrlSortField): AttributeSortField | undefined {
    switch (sort) {
        case AttributeListUrlSortField.name:
            return AttributeSortField.NAME;
        case AttributeListUrlSortField.slug:
            return AttributeSortField.SLUG;
        case AttributeListUrlSortField.searchable:
            return AttributeSortField.FILTERABLE_IN_DASHBOARD;
        case AttributeListUrlSortField.useInFacetedSearch:
            return AttributeSortField.FILTERABLE_IN_STOREFRONT;
        case AttributeListUrlSortField.visible:
            return AttributeSortField.VISIBLE_IN_STOREFRONT;
        default:
            return undefined;
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
