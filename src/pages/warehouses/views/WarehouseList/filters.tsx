import { WarehouseFilterInput } from "@mzawadie/graphql";
import {
    WarehouseListUrlFilters,
    WarehouseListUrlFiltersEnum,
    WarehouseListUrlQueryParams,
} from "@mzawadie/pages/warehouses/urls";
import { createFilterTabUtils, createFilterUtils } from "@mzawadie/utils/filters";

export const WAREHOUSE_FILTERS_KEY = "warehouseFilters";

export function getFilterVariables(params: WarehouseListUrlFilters): WarehouseFilterInput {
    return {
        search: params.query,
    };
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<WarehouseListUrlFilters>(WAREHOUSE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
    WarehouseListUrlQueryParams,
    WarehouseListUrlFilters
>(WarehouseListUrlFiltersEnum);
