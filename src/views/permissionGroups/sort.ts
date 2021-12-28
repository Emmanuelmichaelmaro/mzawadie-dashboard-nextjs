// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getUserName } from "@mzawadie/core";

import { PermissionGroupDetails_permissionGroup_users } from "./types/PermissionGroupDetails";
import { MembersListUrlSortField } from "./urls";

// eslint-disable-next-line import/prefer-default-export
export const sortMembers =
    (sort: MembersListUrlSortField | undefined, asc: boolean | undefined) =>
    (
        a: PermissionGroupDetails_permissionGroup_users,
        b: PermissionGroupDetails_permissionGroup_users
    ) => {
        let valueA;
        let valueB;

        // eslint-disable-next-line default-case
        switch (sort) {
            case MembersListUrlSortField.name:
                valueA = getUserName(a);
                valueB = getUserName(b);
                break;
            case MembersListUrlSortField.email:
                valueA = a.email;
                valueB = b.email;
                break;
        }

        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return asc ? `${valueA}`.localeCompare(valueB) : `${valueA}`.localeCompare(valueB) * -1;
    };
