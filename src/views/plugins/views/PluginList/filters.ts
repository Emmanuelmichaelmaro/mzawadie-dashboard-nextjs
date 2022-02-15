// @ts-nocheck
import { IFilterElement } from "@mzawadie/components/Filter";
import { maybe, parseBoolean } from "@mzawadie/core";
import { ChannelsWithLoadMoreProps } from "@mzawadie/hooks/useChannelsSearch";
import { PluginConfigurationType, PluginFilterInput } from "@mzawadie/types/globalTypes";
import {
    createFilterTabUtils,
    createFilterUtils,
    dedupeFilter,
    getMultipleValueQueryParam,
    getSingleEnumValueQueryParam,
    getSingleValueQueryParam,
} from "@mzawadie/utils/filters";
import { mapNodeToChoice } from "@mzawadie/utils/maps";
import {
    PluginFilterKeys,
    PluginListFilterOpts,
} from "@mzawadie/views/plugins/components/PluginsListPage";

import { PluginListUrlFilters, PluginListUrlFiltersEnum, PluginListUrlQueryParams } from "../../urls";

export const PLUGIN_FILTERS_KEY = "pluginFilters";

export function getFilterOpts(
    params: PluginListUrlFilters,
    { channels, hasMore, onFetchMore, onSearchChange, loading }: ChannelsWithLoadMoreProps
): PluginListFilterOpts {
    return {
        isActive: {
            active: maybe(() => params.active !== undefined, false),
            value: params.active === undefined ? undefined : parseBoolean(params.active, true),
        },
        channels: {
            active: !!params.channels,
            choices: mapNodeToChoice(channels),
            displayValues: mapNodeToChoice(channels),
            initialSearch: "",
            hasMore,
            loading,
            onFetchMore,
            onSearchChange,
            value: dedupeFilter(params.channels || []),
        },
        type: {
            active: !!params.type,
            value: getParsedConfigType(params.type),
        },
        status: {
            active: !!params.channels?.length && params.active !== undefined,
            value: !!dedupeFilter(params.channels || [])?.length && params.active !== undefined,
        },
    };
}

const getParsedConfigType = (configTypeString?: string) =>
    PluginConfigurationType[configTypeString] || undefined;

export function getFilterVariables(params: PluginListUrlFilters): PluginFilterInput {
    const baseParams = {
        type: getParsedConfigType(params.type),
        search: params.query,
    };

    if (!!params.active && !!params.channels?.length) {
        return {
            ...baseParams,
            statusInChannels: {
                active: parseBoolean(params.active, true),
                channels: params.channels,
            },
        };
    }

    return baseParams;
}

export function getFilterQueryParam(filter: IFilterElement<PluginFilterKeys>): PluginListUrlFilters {
    const { name } = filter;

    // eslint-disable-next-line default-case
    switch (name) {
        case PluginFilterKeys.channels:
            return getMultipleValueQueryParam(filter, PluginListUrlFiltersEnum.channels);

        case PluginFilterKeys.active:
            return getSingleValueQueryParam(filter, PluginListUrlFiltersEnum.active);

        case PluginFilterKeys.type:
            return getSingleEnumValueQueryParam(
                filter,
                PluginListUrlFiltersEnum.type,
                PluginConfigurationType
            );
    }
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<PluginListUrlFilters>(PLUGIN_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
    PluginListUrlQueryParams,
    PluginListUrlFilters
>(PluginListUrlFiltersEnum);
