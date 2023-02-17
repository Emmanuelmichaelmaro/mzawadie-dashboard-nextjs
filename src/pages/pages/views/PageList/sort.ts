// @ts-nocheck
import { PageListUrlSortField } from "@mzawadie/pages/pages/urls";
import { PageSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: PageListUrlSortField): PageSortField | undefined {
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

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
