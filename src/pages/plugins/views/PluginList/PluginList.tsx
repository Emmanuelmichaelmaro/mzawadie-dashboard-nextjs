// @ts-nocheck
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialogFormData,
    SaveFilterTabDialog,
} from "@mzawadie/components/SaveFilterTabDialog";
import { maybe } from "@mzawadie/core";
import { ListViews } from "@mzawadie/core";
import { usePluginsQuery } from "@mzawadie/graphql";
import { useChannelsSearchWithLoadMore } from "@mzawadie/hooks/useChannelsSearchWithLoadMore";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState, PaginatorContext } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import React from "react";

import PluginsListPage from "../../components/PluginsListPage/PluginsListPage";
import { pluginListUrl, PluginListUrlDialog, PluginListUrlQueryParams } from "../../urls";
import {
    deleteFilterTab,
    getActiveFilters,
    getFilterOpts,
    getFilterQueryParam,
    getFiltersCurrentTab,
    getFilterTabs,
    getFilterVariables,
    saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface PluginsListProps {
    params: PluginListUrlQueryParams;
}

export const PluginsList: React.FC<PluginsListProps> = ({ params }) => {
    const navigate = useNavigator();

    const { updateListSettings, settings } = useListSettings(ListViews.PLUGINS_LIST);

    usePaginationReset(pluginListUrl, params, settings.rowNumber);

    const paginationState = createPaginationState(settings.rowNumber, params);

    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [params, settings.rowNumber]
    );

    const { data, loading } = usePluginsQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        createUrl: pluginListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        PluginListUrlDialog,
        PluginListUrlQueryParams
    >(navigate, pluginListUrl, params);

    const handleTabChange = (tab: number) => {
        navigate(
            pluginListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleFilterTabDelete = () => {
        deleteFilterTab(currentTab);
        navigate(pluginListUrl());
    };

    const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const paginationValues = usePaginator({
        pageInfo: maybe(() => data.plugins.pageInfo),
        paginationState,
        queryString: params,
    });

    const handleSort = createSortHandler(navigate, pluginListUrl, params);

    const channelsSearchWithLoadMoreProps = useChannelsSearchWithLoadMore();

    const filterOpts = getFilterOpts(params, channelsSearchWithLoadMoreProps);

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <PluginsListPage
                currentTab={currentTab}
                disabled={loading}
                filterOpts={filterOpts}
                initialSearch={params.query || ""}
                settings={settings}
                plugins={mapEdgesToItems(data?.plugins)}
                sort={getSortParams(params)}
                tabs={getFilterTabs().map((tab) => tab.name)}
                onAll={resetFilters}
                onFilterChange={changeFilters}
                onSearchChange={handleSearchChange}
                onSort={handleSort}
                onTabSave={() => openModal("save-search")}
                onTabDelete={() => openModal("delete-search")}
                onTabChange={handleTabChange}
                onUpdateListSettings={updateListSettings}
            />

            <SaveFilterTabDialog
                open={params.action === "save-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleFilterTabSave}
            />

            <DeleteFilterTabDialog
                open={params.action === "delete-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleFilterTabDelete}
                tabName={maybe(() => tabs[currentTab - 1].name, "...")}
            />
        </PaginatorContext.Provider>
    );
};

export default PluginsList;
