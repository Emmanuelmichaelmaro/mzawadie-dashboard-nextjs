/* eslint-disable @typescript-eslint/no-floating-promises,radix */
// @ts-nocheck
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialog,
    SaveFilterTabDialogFormData,
} from "@mzawadie/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/queries";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, getMutationStatus, maybe, sectionNames, ListViews } from "@mzawadie/core";
import { useWarehouseDeleteMutation, useWarehouseListQuery } from "@mzawadie/graphql";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import { WarehouseDeleteDialog } from "@mzawadie/pages/warehouses/components/WarehouseDeleteDialog";
import { WarehouseListPage } from "@mzawadie/pages/warehouses/components/WarehouseListPage";
import {
    warehouseAddUrl,
    warehouseListUrl,
    WarehouseListUrlDialog,
    WarehouseListUrlQueryParams,
    warehouseUrl,
} from "@mzawadie/pages/warehouses/urls";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import {
    areFiltersApplied,
    deleteFilterTab,
    getActiveFilters,
    getFilterTabs,
    getFilterVariables,
    saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

export interface WarehouseListProps {
    params: WarehouseListUrlQueryParams;
}

const WarehouseList: React.FC<WarehouseListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const paginate = usePaginator();
    const intl = useIntl();

    const { updateListSettings, settings } = useListSettings(ListViews.SALES_LIST);

    const paginationState = createPaginationState(settings.rowNumber, params);

    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [paginationState, params]
    );

    const { data, loading, refetch } = useWarehouseListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const limitOpts = useShopLimitsQuery({
        variables: {
            warehouses: true,
        },
    });

    const [deleteWarehouse, deleteWarehouseOpts] = useWarehouseDeleteMutation({
        onCompleted: (data) => {
            if (data.deleteWarehouse?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                refetch();
                limitOpts.refetch();
                closeModal();
            }
        },
    });

    const tabs = getFilterTabs();

    const currentTab =
        params.activeTab === undefined
            ? areFiltersApplied(params)
                ? tabs.length + 1
                : 0
            : parseInt(params.activeTab, 0);

    const [, resetFilters, handleSearchChange] = createFilterHandlers({
        createUrl: warehouseListUrl,
        getFilterQueryParam: () => undefined,
        navigate,
        params,
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        WarehouseListUrlDialog,
        WarehouseListUrlQueryParams
    >(navigate, warehouseListUrl, params);

    const handleTabChange = (tab: number) =>
        navigate(
            warehouseListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        navigate(warehouseListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        maybe(() => data?.warehouses?.pageInfo),
        paginationState,
        params
    );

    const handleSort = createSortHandler(navigate, warehouseListUrl, params);

    const deleteTransitionState = getMutationStatus(deleteWarehouseOpts);

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.warehouses)} />
            <WarehouseListPage
                currentTab={currentTab}
                initialSearch={params.query || ""}
                onSearchChange={handleSearchChange}
                onAll={resetFilters}
                onBack={() => navigate(configurationMenuUrl)}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                limits={limitOpts.data?.shop.limits}
                tabs={tabs.map((tab) => tab.name)}
                warehouses={mapEdgesToItems(data?.warehouses)}
                settings={settings}
                disabled={loading}
                pageInfo={pageInfo}
                onAdd={() => navigate(warehouseAddUrl)}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onRemove={(id) => openModal("delete", { id })}
                onSort={handleSort}
                onUpdateListSettings={updateListSettings}
                onRowClick={(id) => () => navigate(warehouseUrl(id))}
                sort={getSortParams(params)}
            />

            <WarehouseDeleteDialog
                confirmButtonState={deleteTransitionState}
                name={mapEdgesToItems(data?.warehouses)?.find(getById(params.id))?.name}
                open={params.action === "delete"}
                onClose={closeModal}
                onConfirm={() =>
                    deleteWarehouse({
                        variables: {
                            id: params.id,
                        },
                    })
                }
            />

            <SaveFilterTabDialog
                open={params.action === "save-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabSave}
            />

            <DeleteFilterTabDialog
                open={params.action === "delete-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabDelete}
                tabName={maybe(() => tabs[currentTab - 1].name, "...")}
            />
        </>
    );
};

WarehouseList.displayName = "WarehouseList";

export default WarehouseList;
