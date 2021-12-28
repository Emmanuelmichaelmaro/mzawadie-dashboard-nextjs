import { UserSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { CustomerListUrlSortField } from "@mzawadie/views/customers/urls";

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
