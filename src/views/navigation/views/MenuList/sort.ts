// @ts-nocheck
import { MenuSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { MenuListUrlSortField } from "@mzawadie/views/navigation/urls";

export function getSortQueryField(sort: MenuListUrlSortField): MenuSortField | undefined {
    switch (sort) {
        case MenuListUrlSortField.name:
            return MenuSortField.NAME;
        case MenuListUrlSortField.items:
            return MenuSortField.ITEMS_COUNT;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
