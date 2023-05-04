import { PageTypeFilterInput } from "@mzawadie/graphql";
import { createFilterTabUtils, createFilterUtils } from "@mzawadie/utils/filters";

import {
    PageTypeListUrlFilters,
    PageTypeListUrlFiltersEnum,
    PageTypeListUrlQueryParams,
} from "../../urls";

export const PAGE_TYPE_FILTERS_KEY = "pageTypeFilters";

export function getFilterVariables(params: PageTypeListUrlFilters): PageTypeFilterInput {
    return {
        search: params.query,
    };
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<PageTypeListUrlFilters>(PAGE_TYPE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
    PageTypeListUrlQueryParams,
    PageTypeListUrlFilters
>(PageTypeListUrlFiltersEnum);
