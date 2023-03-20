// @ts-nocheck
import { getUserName } from "@mzawadie/core";
import { StaffMemberFragment } from "@mzawadie/graphql";

import { MembersListUrlSortField } from "./urls";

export const sortMembers =
    (sort: string, asc: boolean) => (a: StaffMemberFragment, b: StaffMemberFragment) => {
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

        return asc ? `${valueA}`.localeCompare(valueB) : `${valueA}`.localeCompare(valueB) * -1;
    };
