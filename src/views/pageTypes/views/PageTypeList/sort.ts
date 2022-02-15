// @ts-nocheck
import { PageTypeSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { PageTypeListUrlSortField } from "@mzawadie/views/pageTypes/urls";

export function getSortQueryField(sort: PageTypeListUrlSortField): PageTypeSortField | undefined {
    if (sort === PageTypeListUrlSortField.name) {
        return PageTypeSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
