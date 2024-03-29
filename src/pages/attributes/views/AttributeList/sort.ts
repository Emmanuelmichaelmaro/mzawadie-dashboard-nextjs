import { AttributeSortField } from "@mzawadie/graphql";
import { AttributeListUrlSortField } from "@mzawadie/pages/attributes/urls";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

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
