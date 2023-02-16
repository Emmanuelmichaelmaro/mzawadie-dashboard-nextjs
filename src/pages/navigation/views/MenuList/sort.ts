// @ts-nocheck
import { MenuListUrlSortField } from "@mzawadie/pages/navigation/urls";
import { MenuSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

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
