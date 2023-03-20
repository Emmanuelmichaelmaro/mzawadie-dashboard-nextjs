// @ts-nocheck
import { WarehouseSortField } from "@mzawadie/graphql";
import { WarehouseListUrlSortField } from "@mzawadie/pages/warehouses/urls";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: WarehouseListUrlSortField): WarehouseSortField {
    if (sort === WarehouseListUrlSortField.name) {
        return WarehouseSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
