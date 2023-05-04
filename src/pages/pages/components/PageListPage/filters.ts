// @ts-nocheck
import { FilterElement, IFilter } from "@mzawadie/components/Filter";
import { ActiveTab, AutocompleteFilterOpts, FilterOpts, Pagination, Search } from "@mzawadie/core";
import { SearchPageTypesQuery } from "@mzawadie/graphql";
import { SearchWithFetchMoreProps } from "@mzawadie/pages/giftCards/components/GiftCardsList/GiftCardListSearchAndFilters/types";
import {
    PageListUrlFilters,
    PageListUrlFiltersWithMultipleValues,
    PageListUrlSort,
} from "@mzawadie/pages/pages/urls";
import {
    createFilterTabUtils,
    createFilterUtils,
    getMultipleValueQueryParam,
} from "@mzawadie/utils/filters";
import { createAutocompleteField } from "@mzawadie/utils/filters/fields";
import { mapNodeToChoice, mapSingleValueNodeToChoice } from "@mzawadie/utils/maps";
import { defineMessages, IntlShape } from "react-intl";

export enum PageListFilterKeys {
    pageTypes = "pageTypes",
}

export const PAGES_FILTERS_KEY = "pagesFilters";

export interface PageListFilterOpts {
    pageType: FilterOpts<string[]> & AutocompleteFilterOpts;
}

const messages = defineMessages({
    pageType: {
        id: "Of19Pn",
        defaultMessage: "Page Types",
        description: "Types",
    },
});

interface PageListFilterOptsProps {
    params: PageListUrlFilters;
    pageTypes: Array<SearchPageTypesQuery["search"]["edges"][0]["node"]>;
    pageTypesProps: SearchWithFetchMoreProps;
}

export const getFilterOpts = ({
    params,
    pageTypes,
    pageTypesProps,
}: PageListFilterOptsProps): PageListFilterOpts => ({
    pageType: {
        active: !!params?.pageTypes,
        value: params?.pageTypes,
        choices: mapNodeToChoice(pageTypes),
        displayValues: mapSingleValueNodeToChoice(pageTypes),
        initialSearch: "",
        hasMore: pageTypesProps.hasMore,
        loading: pageTypesProps.loading,
        onFetchMore: pageTypesProps.onFetchMore,
        onSearchChange: pageTypesProps.onSearchChange,
    },
});

export function createFilterStructure(
    intl: IntlShape,
    opts: PageListFilterOpts
): IFilter<PageListFilterKeys> {
    return [
        {
            ...createAutocompleteField(
                PageListFilterKeys.pageTypes,
                intl.formatMessage(messages.pageType),
                opts.pageType.value,
                opts.pageType.displayValues,
                true,
                opts.pageType.choices,
                {
                    hasMore: opts.pageType.hasMore,
                    initialSearch: "",
                    loading: opts.pageType.loading,
                    onFetchMore: opts.pageType.onFetchMore,
                    onSearchChange: opts.pageType.onSearchChange,
                }
            ),
            active: opts.pageType.active,
        },
    ];
}

export function getFilterQueryParam(filter: FilterElement<PageListFilterKeys>): PageListUrlFilters {
    const { name } = filter;

    const { pageTypes } = PageListFilterKeys;

    switch (name) {
        case pageTypes:
            return getMultipleValueQueryParam(filter, name);
    }
}

export type PageListUrlQueryParams = Pagination &
    PageListUrlFilters &
    PageListUrlSort &
    ActiveTab &
    Search;

export const { deleteFilterTab, getFilterTabs, saveFilterTab } =
    createFilterTabUtils<PageListUrlFilters>(PAGES_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
    PageListUrlQueryParams,
    PageListUrlFilters
>(PageListUrlFiltersWithMultipleValues);
