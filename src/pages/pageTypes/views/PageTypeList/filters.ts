import { PageTypeFilterInput } from "@mzawadie/graphql";
import {
    PageTypeListUrlFilters,
    PageTypeListUrlFiltersEnum,
    PageTypeListUrlQueryParams,
} from "@mzawadie/pages/pageTypes/urls";
import { createFilterTabUtils, createFilterUtils } from "@mzawadie/utils/filters";

export const PAGE_TYPE_FILTERS_KEY = "pageTypeFilters";

export function getFilterVariables(params: PageTypeListUrlFilters): PageTypeFilterInput {
    return {
        search: params.query,
    };
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<PageTypeListUrlFilters>(PAGE_TYPE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
    PageTypeListUrlQueryParams,
    PageTypeListUrlFilters
>(PageTypeListUrlFiltersEnum);
