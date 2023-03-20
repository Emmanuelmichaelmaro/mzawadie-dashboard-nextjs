// @ts-nocheck
import { UserSortField } from "@mzawadie/graphql";
import { CustomerListUrlSortField } from "@mzawadie/pages/customers/urls";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: CustomerListUrlSortField): UserSortField | undefined {
    switch (sort) {
        case CustomerListUrlSortField.email:
            return UserSortField.EMAIL;
        case CustomerListUrlSortField.name:
            return UserSortField.LAST_NAME;
        case CustomerListUrlSortField.orders:
            return UserSortField.ORDER_COUNT;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
