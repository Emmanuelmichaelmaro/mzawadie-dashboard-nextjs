// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { PermissionGroupSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { PermissionGroupListUrlSortField } from "@mzawadie/views/permissionGroups/urls";

export function getSortQueryField(sort: PermissionGroupListUrlSortField): PermissionGroupSortField {
    if (sort === PermissionGroupListUrlSortField.name) {
        return PermissionGroupSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
