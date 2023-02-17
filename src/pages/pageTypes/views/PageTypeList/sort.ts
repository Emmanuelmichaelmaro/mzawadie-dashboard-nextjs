// @ts-nocheck
import { PageTypeListUrlSortField } from "@mzawadie/pages/pageTypes/urls";
import { PageTypeSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: PageTypeListUrlSortField): PageTypeSortField | undefined {
    if (sort === PageTypeListUrlSortField.name) {
        return PageTypeSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
