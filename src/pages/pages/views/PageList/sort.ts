// @ts-nocheck
import { PageFilterInput, PageSortField } from "@mzawadie/graphql";
import { PageListUrlFilters, PageListUrlSortField } from "@mzawadie/pages/pages/urls";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: PageListUrlSortField): PageSortField {
    switch (sort) {
        case PageListUrlSortField.title:
            return PageSortField.TITLE;
        case PageListUrlSortField.visible:
            return PageSortField.VISIBILITY;
        case PageListUrlSortField.slug:
            return PageSortField.SLUG;
        default:
            return undefined;
    }
}

export function getFilterVariables(params: PageListUrlFilters): PageFilterInput {
    return {
        search: params.query,
        pageTypes: params.pageTypes,
    };
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
