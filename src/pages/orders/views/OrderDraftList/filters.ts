// @ts-nocheck
import { IFilterElement } from "@mzawadie/components/Filter";
import { maybe } from "@mzawadie/core";
import { OrderDraftFilterInput } from "@mzawadie/graphql";
import {
    OrderDraftFilterKeys,
    OrderDraftListFilterOpts,
} from "@mzawadie/pages/orders/components/OrderDraftListPage";
import {
    createFilterTabUtils,
    createFilterUtils,
    getGteLteVariables,
    getMinMaxQueryParam,
    getSingleValueQueryParam,
} from "@mzawadie/utils/filters";

import {
    OrderDraftListUrlFilters,
    OrderDraftListUrlFiltersEnum,
    OrderDraftListUrlQueryParams,
} from "../../urls";

export const ORDER_DRAFT_FILTERS_KEY = "orderDraftFilters";

export function getFilterOpts(params: OrderDraftListUrlFilters): OrderDraftListFilterOpts {
    return {
        created: {
            active: maybe(
                () => [params.createdFrom, params.createdTo].some((field) => field !== undefined),
                false
            ),
            value: {
                max: maybe(() => params.createdTo),
                min: maybe(() => params.createdFrom),
            },
        },
        customer: {
            active: !!maybe(() => params.customer),
            value: params.customer,
        },
    };
}

export function getFilterVariables(params: OrderDraftListUrlFilters): OrderDraftFilterInput {
    return {
        created: getGteLteVariables({
            gte: params.createdFrom,
            lte: params.createdTo,
        }),
        customer: params.customer,
        search: params.query,
    };
}

export function getFilterQueryParam(
    filter: IFilterElement<OrderDraftFilterKeys>
): OrderDraftListUrlFilters {
    const { name } = filter;

    switch (name) {
        case OrderDraftFilterKeys.created:
            return getMinMaxQueryParam(
                filter,
                OrderDraftListUrlFiltersEnum.createdFrom,
                OrderDraftListUrlFiltersEnum.createdTo
            );

        case OrderDraftFilterKeys.customer:
            return getSingleValueQueryParam(filter, OrderDraftListUrlFiltersEnum.customer);
    }
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<OrderDraftListUrlFilters>(ORDER_DRAFT_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
    OrderDraftListUrlQueryParams,
    OrderDraftListUrlFilters
>(OrderDraftListUrlFiltersEnum);
