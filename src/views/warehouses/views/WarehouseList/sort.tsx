// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { WarehouseSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { WarehouseListUrlSortField } from "@mzawadie/views/warehouses/urls";

export function getSortQueryField(sort: WarehouseListUrlSortField): WarehouseSortField {
    if (sort === WarehouseListUrlSortField.name) {
        return WarehouseSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
