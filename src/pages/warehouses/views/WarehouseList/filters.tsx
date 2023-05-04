import { WarehouseFilterInput } from "@mzawadie/graphql";
import { createFilterTabUtils, createFilterUtils } from "@mzawadie/utils/filters";

import {
    WarehouseListUrlFilters,
    WarehouseListUrlFiltersEnum,
    WarehouseListUrlQueryParams,
} from "../../urls";

export const WAREHOUSE_FILTERS_KEY = "warehouseFilters";

export function getFilterVariables(params: WarehouseListUrlFilters): WarehouseFilterInput {
    return {
        search: params.query,
    };
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<WarehouseListUrlFilters>(WAREHOUSE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
    WarehouseListUrlQueryParams,
    WarehouseListUrlFilters
>(WarehouseListUrlFiltersEnum);
