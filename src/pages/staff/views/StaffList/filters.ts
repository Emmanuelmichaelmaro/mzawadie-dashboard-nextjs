// @ts-nocheck
import { IFilterElement } from "@mzawadie/components/Filter";
import { findValueInEnum, maybe } from "@mzawadie/core";
import { StaffMemberStatus, StaffUserInput } from "@mzawadie/graphql";
import { StaffFilterKeys, StaffListFilterOpts } from "@mzawadie/pages/staff/components/StaffListPage";
import {
    StaffListUrlFilters,
    StaffListUrlFiltersEnum,
    StaffListUrlQueryParams,
} from "@mzawadie/pages/staff/urls";
import {
    createFilterTabUtils,
    createFilterUtils,
    getSingleEnumValueQueryParam,
} from "@mzawadie/utils/filters";

export const STAFF_FILTERS_KEY = "staffFilters";

export function getFilterOpts(params: StaffListUrlFilters): StaffListFilterOpts {
    return {
        status: {
            active: maybe(() => params.status !== undefined, false),
            value: maybe(() => findValueInEnum(params.status, StaffMemberStatus)),
        },
    };
}

export function getFilterVariables(params: StaffListUrlFilters): StaffUserInput {
    return {
        search: params.query,
        status: params.status ? findValueInEnum(params.status, StaffMemberStatus) : null,
    };
}

// eslint-disable-next-line consistent-return
export function getFilterQueryParam(filter: IFilterElement<StaffFilterKeys>): StaffListUrlFilters {
    const { name } = filter;

    // eslint-disable-next-line default-case
    switch (name) {
        case StaffFilterKeys.status:
            return getSingleEnumValueQueryParam(
                filter,
                StaffListUrlFiltersEnum.status,
                StaffMemberStatus
            );
    }
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<StaffListUrlFilters>(STAFF_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
    StaffListUrlQueryParams,
    StaffListUrlFilters
>(StaffListUrlFiltersEnum);
