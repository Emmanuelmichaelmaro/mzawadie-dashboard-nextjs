// @ts-nocheck
import { IFilterElement } from "@mzawadie/components/Filter";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { findValueInEnum, maybe } from "@mzawadie/core";
import {
    CollectionFilterKeys,
    CollectionListFilterOpts,
} from "@mzawadie/pages/collections/components/CollectionListPage";
import { CollectionFilterInput, CollectionPublished } from "@mzawadie/types/globalTypes";
import {
    createFilterTabUtils,
    createFilterUtils,
    getSingleEnumValueQueryParam,
    getSingleValueQueryParam,
} from "@mzawadie/utils/filters";

import {
    CollectionListUrlFilters,
    CollectionListUrlFiltersEnum,
    CollectionListUrlQueryParams,
} from "../../urls";

export const COLLECTION_FILTERS_KEY = "collectionFilters";

export function getFilterOpts(
    params: CollectionListUrlFilters,
    channels: SingleAutocompleteChoiceType[]
): CollectionListFilterOpts {
    return {
        channel: {
            active: params?.channel !== undefined,
            choices: channels,
            value: params?.channel,
        },
        status: {
            active: maybe(() => params.status !== undefined, false),
            value: maybe(() => findValueInEnum(status, CollectionPublished)),
        },
    };
}

export function getFilterVariables(params: CollectionListUrlFilters): CollectionFilterInput {
    return {
        published: params.status ? findValueInEnum(params.status, CollectionPublished) : undefined,
        search: params.query,
    };
}

export function getFilterQueryParam(
    filter: IFilterElement<CollectionFilterKeys>
): CollectionListUrlFilters {
    const { name } = filter;

    switch (name) {
        case CollectionFilterKeys.status:
            return getSingleEnumValueQueryParam(
                filter,
                CollectionListUrlFiltersEnum.status,
                CollectionPublished
            );
        case CollectionFilterKeys.channel:
            return getSingleValueQueryParam(filter, CollectionListUrlFiltersEnum.channel);
    }
}

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<CollectionListUrlFilters>(COLLECTION_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
    CollectionListUrlQueryParams,
    CollectionListUrlFilters
>(CollectionListUrlFiltersEnum);
