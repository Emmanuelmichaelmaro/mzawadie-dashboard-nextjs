// @ts-nocheck
import { PermissionGroupListUrlSortField } from "@mzawadie/pages/permissionGroups/urls";
import { PermissionGroupSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: PermissionGroupListUrlSortField): PermissionGroupSortField {
    if (sort === PermissionGroupListUrlSortField.name) {
        return PermissionGroupSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
