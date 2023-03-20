// @ts-nocheck
import { IFilter } from "@mzawadie/components/Filter";
import { hasPermissions } from "@mzawadie/components/RequirePermissions";
import { FilterOpts, MinMax } from "@mzawadie/core";
import { PermissionEnum, UserFragment } from "@mzawadie/graphql";
import { createDateField, createNumberField } from "@mzawadie/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum CustomerFilterKeys {
    joined = "joined",
    numberOfOrders = "orders",
}

export interface CustomerListFilterOpts {
    joined: FilterOpts<MinMax>;
    numberOfOrders: FilterOpts<MinMax>;
}

const messages = defineMessages({
    joinDate: {
        defaultMessage: "Join Date",
        id: "icz/jb",
        description: "customer",
    },
    numberOfOrders: {
        defaultMessage: "Number of Orders",
        id: "fhksPD",
    },
});

export function createFilterStructure(
    intl: IntlShape,
    opts: CustomerListFilterOpts,
    userPermissions: UserFragment["userPermissions"]
): IFilter<CustomerFilterKeys> {
    return [
        {
            ...createDateField(
                CustomerFilterKeys.joined,
                intl.formatMessage(messages.joinDate),
                opts.joined.value
            ),
            active: opts.joined.active,
        },
        {
            ...createNumberField(
                CustomerFilterKeys.numberOfOrders,
                intl.formatMessage(messages.numberOfOrders),
                opts.numberOfOrders.value
            ),
            active: opts.numberOfOrders.active,
            permissions: [PermissionEnum.MANAGE_ORDERS],
        },
    ].filter((filter) => hasPermissions(userPermissions, filter.permissions ?? []));
}
