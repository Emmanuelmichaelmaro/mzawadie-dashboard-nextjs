import { CategoryFilterInput } from "@mzawadie/types/globalTypes";
import { createFilterTabUtils, createFilterUtils } from "@mzawadie/utils/filters";

import {
    CategoryListUrlFilters,
    CategoryListUrlFiltersEnum,
    CategoryListUrlQueryParams,
} from "../../urls";

export const CATEGORY_FILTERS_KEY = "categoryFilters";

export function getFilterVariables(params: CategoryListUrlFilters): CategoryFilterInput {
    return {
        search: params.query,
    };
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<CategoryListUrlFilters>(CATEGORY_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
    CategoryListUrlQueryParams,
    CategoryListUrlFilters
>(CategoryListUrlFiltersEnum);
