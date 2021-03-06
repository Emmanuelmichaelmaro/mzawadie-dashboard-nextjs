// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { IFilterElement } from "@mzawadie/components/Filter";
import { maybe } from "@mzawadie/core";
import { CustomerFilterInput } from "@mzawadie/types/globalTypes";
import {
    createFilterTabUtils,
    createFilterUtils,
    getGteLteVariables,
    getMinMaxQueryParam,
} from "@mzawadie/utils/filters";
import {
    CustomerFilterKeys,
    CustomerListFilterOpts,
} from "@mzawadie/views/customers/components/CustomerListPage";

import {
    CustomerListUrlFilters,
    CustomerListUrlFiltersEnum,
    CustomerListUrlQueryParams,
} from "../../urls";

export const CUSTOMER_FILTERS_KEY = "customerFilters";

export function getFilterOpts(params: CustomerListUrlFilters): CustomerListFilterOpts {
    return {
        joined: {
            active: maybe(
                () => [params.joinedFrom, params.joinedTo].some((field) => field !== undefined),
                false
            ),
            value: {
                max: maybe(() => params.joinedTo, ""),
                min: maybe(() => params.joinedFrom, ""),
            },
        },
        numberOfOrders: {
            active: maybe(
                () =>
                    [params.numberOfOrdersFrom, params.numberOfOrdersTo].some(
                        (field) => field !== undefined
                    ),
                false
            ),
            value: {
                max: maybe(() => params.numberOfOrdersTo, ""),
                min: maybe(() => params.numberOfOrdersFrom, ""),
            },
        },
    };
}

export function getFilterVariables(params: CustomerListUrlFilters): CustomerFilterInput {
    return {
        dateJoined: getGteLteVariables({
            gte: params.joinedFrom,
            lte: params.joinedTo,
        }),
        numberOfOrders: getGteLteVariables({
            gte: parseInt(params.numberOfOrdersFrom, 0),
            lte: parseInt(params.numberOfOrdersTo, 0),
        }),
        search: params.query,
    };
}

export function getFilterQueryParam(
    filter: IFilterElement<CustomerFilterKeys>
): CustomerListUrlFilters {
    const { name } = filter;

    // eslint-disable-next-line default-case
    switch (name) {
        case CustomerFilterKeys.joined:
            return getMinMaxQueryParam(
                filter,
                CustomerListUrlFiltersEnum.joinedFrom,
                CustomerListUrlFiltersEnum.joinedTo
            );

        case CustomerFilterKeys.numberOfOrders:
            return getMinMaxQueryParam(
                filter,
                CustomerListUrlFiltersEnum.numberOfOrdersFrom,
                CustomerListUrlFiltersEnum.numberOfOrdersTo
            );
    }
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<CustomerListUrlFilters>(CUSTOMER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
    CustomerListUrlQueryParams,
    CustomerListUrlFilters
>(CustomerListUrlFiltersEnum);
