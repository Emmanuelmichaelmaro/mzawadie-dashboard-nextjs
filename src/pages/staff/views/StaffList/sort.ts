// @ts-nocheck
import { StaffListUrlSortField } from "@mzawadie/pages/staff/urls";
import { UserSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: StaffListUrlSortField): UserSortField | undefined {
    switch (sort) {
        case StaffListUrlSortField.name:
            return UserSortField.LAST_NAME;
        case StaffListUrlSortField.email:
            return UserSortField.EMAIL;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
