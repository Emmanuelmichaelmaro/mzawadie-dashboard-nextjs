// @ts-nocheck
import { PluginSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";
import { PluginListUrlSortField } from "@mzawadie/views/plugins/urls";

export function getSortQueryField(sort: PluginListUrlSortField): PluginSortField | undefined {
    switch (sort) {
        case PluginListUrlSortField.name:
            return PluginSortField.NAME;
        case PluginListUrlSortField.active:
            return PluginSortField.IS_ACTIVE;
        default:
            return undefined;
    }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
