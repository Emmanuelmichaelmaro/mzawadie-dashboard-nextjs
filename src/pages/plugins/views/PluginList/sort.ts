// @ts-nocheck
import { PluginListUrlSortField } from "@mzawadie/pages/plugins/urls";
import { PluginSortField } from "@mzawadie/types/globalTypes";
import { createGetSortQueryVariables } from "@mzawadie/utils/sort";

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
