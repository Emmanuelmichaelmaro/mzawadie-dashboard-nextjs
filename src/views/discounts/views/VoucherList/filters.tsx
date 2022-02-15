// @ts-nocheck
import { IFilterElement } from "@mzawadie/components/Filter";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { findValueInEnum, joinDateTime, maybe } from "@mzawadie/core";
import {
    DiscountStatusEnum,
    VoucherDiscountType,
    VoucherFilterInput,
} from "@mzawadie/types/globalTypes";
import {
    createFilterTabUtils,
    createFilterUtils,
    dedupeFilter,
    getGteLteVariables,
    getMinMaxQueryParam,
    getMultipleEnumValueQueryParam,
    getSingleValueQueryParam,
} from "@mzawadie/utils/filters";
import {
    VoucherFilterKeys,
    VoucherListFilterOpts,
} from "@mzawadie/views/discounts/components/VoucherListPage";

import {
    VoucherListUrlFilters,
    VoucherListUrlFiltersEnum,
    VoucherListUrlFiltersWithMultipleValues,
    VoucherListUrlQueryParams,
} from "../../urls";

export const VOUCHER_FILTERS_KEY = "voucherFilters";

export function getFilterOpts(
    params: VoucherListUrlFilters,
    channels: SingleAutocompleteChoiceType[]
): VoucherListFilterOpts {
    return {
        channel: {
            active: params?.channel !== undefined,
            choices: channels,
            value: params?.channel,
        },
        saleType: {
            active: !!maybe(() => params.type),
            value: dedupeFilter(
                params.type?.map((type) => findValueInEnum(type, VoucherDiscountType)) || []
            ),
        },
        started: {
            active: maybe(
                () => [params.startedFrom, params.startedTo].some((field) => field !== undefined),
                false
            ),
            value: {
                max: maybe(() => params.startedTo, ""),
                min: maybe(() => params.startedFrom, ""),
            },
        },
        status: {
            active: !!maybe(() => params.status),
            value: dedupeFilter(
                params.status?.map((status) => findValueInEnum(status, DiscountStatusEnum)) || []
            ),
        },
        timesUsed: {
            active: maybe(
                () => [params.timesUsedFrom, params.timesUsedTo].some((field) => field !== undefined),
                false
            ),
            value: {
                max: maybe(() => params.timesUsedTo, ""),
                min: maybe(() => params.timesUsedFrom, ""),
            },
        },
    };
}

export function getFilterVariables(params: VoucherListUrlFilters): VoucherFilterInput {
    return {
        discountType:
            params.type && params.type.map((type) => findValueInEnum(type, VoucherDiscountType)),
        search: params.query,
        started: getGteLteVariables({
            gte: joinDateTime(params.startedFrom),
            lte: joinDateTime(params.startedTo),
        }),
        status:
            params.status && params.status.map((status) => findValueInEnum(status, DiscountStatusEnum)),
        timesUsed: getGteLteVariables({
            gte: parseInt(params.timesUsedFrom, 0),
            lte: parseInt(params.timesUsedTo, 0),
        }),
    };
}

export function getFilterQueryParam(filter: IFilterElement<VoucherFilterKeys>): VoucherListUrlFilters {
    const { name } = filter;

    // eslint-disable-next-line default-case
    switch (name) {
        case VoucherFilterKeys.saleType:
            return getMultipleEnumValueQueryParam(
                filter,
                VoucherListUrlFiltersWithMultipleValues.type,
                VoucherDiscountType
            );

        case VoucherFilterKeys.started:
            return getMinMaxQueryParam(
                filter,
                VoucherListUrlFiltersEnum.startedFrom,
                VoucherListUrlFiltersEnum.startedTo
            );

        case VoucherFilterKeys.timesUsed:
            return getMinMaxQueryParam(
                filter,
                VoucherListUrlFiltersEnum.timesUsedFrom,
                VoucherListUrlFiltersEnum.timesUsedTo
            );

        case VoucherFilterKeys.status:
            return getMultipleEnumValueQueryParam(
                filter,
                VoucherListUrlFiltersWithMultipleValues.status,
                DiscountStatusEnum
            );

        case VoucherFilterKeys.channel:
            return getSingleValueQueryParam(filter, VoucherListUrlFiltersEnum.channel);
    }
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<VoucherListUrlFilters>(VOUCHER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
    VoucherListUrlQueryParams,
    VoucherListUrlFilters
>({
    ...VoucherListUrlFiltersEnum,
    ...VoucherListUrlFiltersWithMultipleValues,
});
