import { IFilter } from "@mzawadie/components";
import { ActiveTab, Pagination, Search, Sort } from "@mzawadie/core";
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";

import { GetFilterQueryParam, getFilterQueryParams } from "../filters";

type RequiredParams = ActiveTab & Search & Sort & Pagination;
type CreateUrl = (params: RequiredParams) => string;
type CreateFilterHandlers<TFilterKeys extends string> = [
    (filter: IFilter<TFilterKeys>) => void,
    () => void,
    (query: string) => void
];

function createFilterHandlers<TFilterKeys extends string, TFilters extends {}>(opts: {
    getFilterQueryParam: GetFilterQueryParam<TFilterKeys, TFilters>;
    navigate: UseNavigatorResult;
    createUrl: CreateUrl;
    params: RequiredParams;
    cleanupFn?: () => void;
}): CreateFilterHandlers<TFilterKeys> {
    const { getFilterQueryParam, navigate, createUrl, params, cleanupFn } = opts;

    const changeFilters = (filter: IFilter<TFilterKeys>) => {
        if (cleanupFn) {
            cleanupFn();
        }

        navigate(
            createUrl({
                ...params,
                ...getFilterQueryParams(filter, getFilterQueryParam),
                activeTab: undefined,
            })
        );
    };

    const resetFilters = () => {
        if (cleanupFn) {
            cleanupFn();
        }

        navigate(
            createUrl({
                asc: params.asc,
                sort: params.sort,
            })
        );
    };

    const handleSearchChange = (query: string) => {
        if (cleanupFn) {
            cleanupFn();
        }

        navigate(
            createUrl({
                ...params,
                after: undefined,
                before: undefined,
                activeTab: undefined,
                query,
            })
        );
    };

    return [changeFilters, resetFilters, handleSearchChange];
}

export default createFilterHandlers;
