// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { WarehouseListUrlSortField } from "@mzawadie/pages/warehouses/urls";
import { WarehouseSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

export function getSortQueryField(sort: WarehouseListUrlSortField): WarehouseSortField {
    if (sort === WarehouseListUrlSortField.name) {
        return WarehouseSortField.NAME;
    }
    return undefined;
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
