// @ts-nocheck
import { IFilterElement } from "@mzawadie/components/Filter";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { findValueInEnum, joinDateTime, maybe } from "@mzawadie/core";
import { SaleFilterKeys, SaleListFilterOpts } from "@mzawadie/pages/discounts/components/SaleListPage";
import {
    SaleListUrlFilters,
    SaleListUrlFiltersEnum,
    SaleListUrlFiltersWithMultipleValues,
    SaleListUrlQueryParams,
} from "@mzawadie/pages/discounts/urls";
import {
    DiscountStatusEnum,
    DiscountValueTypeEnum,
    SaleFilterInput,
} from "@mzawadie/types/globalTypes";
import {
    createFilterTabUtils,
    createFilterUtils,
    dedupeFilter,
    getGteLteVariables,
    getMinMaxQueryParam,
    getMultipleEnumValueQueryParam,
    getSingleEnumValueQueryParam,
    getSingleValueQueryParam,
} from "@mzawadie/utils/filters";

export const SALE_FILTERS_KEY = "saleFilters";

export function getFilterOpts(
    params: SaleListUrlFilters,
    channels: SingleAutocompleteChoiceType[]
): SaleListFilterOpts {
    return {
        channel: {
            active: params?.channel !== undefined,
            choices: channels,
            value: params?.channel,
        },
        saleType: {
            active: !!maybe(() => params.type),
            value: maybe(() => findValueInEnum(params.type, DiscountValueTypeEnum)),
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
    };
}

export function getFilterVariables(params: SaleListUrlFilters): SaleFilterInput {
    return {
        saleType: params.type && findValueInEnum(params.type, DiscountValueTypeEnum),
        search: params.query,
        started: getGteLteVariables({
            gte: joinDateTime(params.startedFrom),
            lte: joinDateTime(params.startedTo),
        }),
        status:
            params.status && params.status.map((status) => findValueInEnum(status, DiscountStatusEnum)),
    };
}

export function getFilterQueryParam(filter: IFilterElement<SaleFilterKeys>): SaleListUrlFilters {
    const { name } = filter;

    // eslint-disable-next-line default-case
    switch (name) {
        case SaleFilterKeys.saleType:
            return getSingleEnumValueQueryParam(
                filter,
                SaleListUrlFiltersEnum.type,
                DiscountValueTypeEnum
            );

        case SaleFilterKeys.started:
            return getMinMaxQueryParam(
                filter,
                SaleListUrlFiltersEnum.startedFrom,
                SaleListUrlFiltersEnum.startedTo
            );

        case SaleFilterKeys.status:
            return getMultipleEnumValueQueryParam(
                filter,
                SaleListUrlFiltersWithMultipleValues.status,
                DiscountStatusEnum
            );

        case SaleFilterKeys.channel:
            return getSingleValueQueryParam(filter, SaleListUrlFiltersEnum.channel);
    }
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<SaleListUrlFilters>(SALE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
    SaleListUrlQueryParams,
    SaleListUrlFilters
>({
    ...SaleListUrlFiltersEnum,
    ...SaleListUrlFiltersWithMultipleValues,
});
