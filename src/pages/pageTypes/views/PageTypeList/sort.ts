// @ts-nocheck
import { PageTypeSortField } from "@mzawadie/graphql";
import { PageTypeListUrlSortField } from "@mzawadie/pages/pageTypes/urls";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: PageTypeListUrlSortField): PageTypeSortField | undefined {
    if (sort === PageTypeListUrlSortField.name) {
        return PageTypeSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
