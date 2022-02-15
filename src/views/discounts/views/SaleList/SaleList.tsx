// @ts-nocheck
import { DialogContentText, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@mzawadie/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
    SaveFilterTabDialogFormData,
} from "@mzawadie/components/SaveFilterTabDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, sectionNames, maybe, ListViews } from "@mzawadie/core";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import SaleListPage from "../../components/SaleListPage";
import { TypedSaleBulkDelete } from "../../mutations";
import { useSaleListQuery } from "../../queries";
import { SaleBulkDelete } from "../../types/SaleBulkDelete";
import {
    saleAddUrl,
    saleListUrl,
    SaleListUrlDialog,
    SaleListUrlQueryParams,
    saleUrl,
} from "../../urls";
import {
    areFiltersApplied,
    deleteFilterTab,
    getActiveFilters,
    getFilterOpts,
    getFilterQueryParam,
    getFilterTabs,
    getFilterVariables,
    saveFilterTab,
} from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface SaleListProps {
    params: SaleListUrlQueryParams;
}

export const SaleList: React.FC<SaleListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const paginate = usePaginator();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const { updateListSettings, settings } = useListSettings(ListViews.SALES_LIST);
    const intl = useIntl();
    const { availableChannels } = useAppChannel(false);
    const selectedChannel = availableChannels.find((channel) => channel.slug === params.channel);
    const channelOpts = availableChannels
        ? mapNodeToChoice(availableChannels, (channel) => channel.slug)
        : null;

    const [openModal, closeModal] = createDialogActionHandlers<
        SaleListUrlDialog,
        SaleListUrlQueryParams
    >(navigate, saleListUrl, params);

    const paginationState = createPaginationState(settings.rowNumber, params);
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
            channel: params.channel,
        }),
        [params]
    );
    const { data, loading, refetch } = useSaleListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const tabs = getFilterTabs();

    const currentTab =
        params.activeTab === undefined
            ? areFiltersApplied(params)
                ? tabs.length + 1
                : 0
            : parseInt(params.activeTab, 0);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: saleListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    useEffect(() => {
        if (!canBeSorted(params.sort, !!selectedChannel)) {
            navigate(
                saleListUrl({
                    ...params,
                    sort: DEFAULT_SORT_KEY,
                })
            );
        }
    }, [params]);

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            saleListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(saleListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        maybe(() => data.sales.pageInfo),
        paginationState,
        params
    );

    const handleSaleBulkDelete = (data: SaleBulkDelete) => {
        if (data.saleBulkDelete.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            reset();
            closeModal();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            refetch();
        }
    };

    const handleSort = createSortHandler(navigate, saleListUrl, params);

    return (
        <TypedSaleBulkDelete onCompleted={handleSaleBulkDelete}>
            {(saleBulkDelete, saleBulkDeleteOpts) => {
                const onSaleBulkDelete = () =>
                    saleBulkDelete({
                        variables: {
                            ids: params.ids,
                        },
                    });

                return (
                    <>
                        <WindowTitle title={intl.formatMessage(sectionNames.sales)} />
                        <SaleListPage
                            currentTab={currentTab}
                            filterOpts={getFilterOpts(params, channelOpts)}
                            initialSearch={params.query || ""}
                            onSearchChange={handleSearchChange}
                            onFilterChange={(filter) => changeFilters(filter)}
                            onAll={resetFilters}
                            onTabChange={handleTabChange}
                            onTabDelete={() => openModal("delete-search")}
                            onTabSave={() => openModal("save-search")}
                            tabs={tabs.map((tab) => tab.name)}
                            sales={mapEdgesToItems(data?.sales)}
                            settings={settings}
                            disabled={loading}
                            pageInfo={pageInfo}
                            onAdd={() => navigate(saleAddUrl())}
                            onNextPage={loadNextPage}
                            onPreviousPage={loadPreviousPage}
                            onSort={handleSort}
                            onUpdateListSettings={updateListSettings}
                            onRowClick={(id) => () => navigate(saleUrl(id))}
                            isChecked={isSelected}
                            selected={listElements.length}
                            sort={getSortParams(params)}
                            toggle={toggle}
                            toggleAll={toggleAll}
                            toolbar={
                                <IconButton
                                    color="primary"
                                    onClick={() =>
                                        openModal("remove", {
                                            ids: listElements,
                                        })
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                            selectedChannelId={selectedChannel?.id}
                        />
                        <ActionDialog
                            confirmButtonState={saleBulkDeleteOpts.status}
                            onClose={closeModal}
                            onConfirm={onSaleBulkDelete}
                            open={params.action === "remove" && canOpenBulkActionDialog}
                            title={intl.formatMessage({
                                defaultMessage: "Delete Sales",
                                id: "ZWIjvr",
                                description: "dialog header",
                            })}
                            variant="delete"
                        >
                            {canOpenBulkActionDialog && (
                                <DialogContentText>
                                    <FormattedMessage
                                        defaultMessage="{counter,plural,one{Are you sure you want to delete this sale?} other{Are you sure you want to delete {displayQuantity} sales?}}"
                                        id="FPzzh7"
                                        description="dialog content"
                                        values={{
                                            counter: params.ids.length,
                                            displayQuantity: <strong>{params.ids.length}</strong>,
                                        }}
                                    />
                                </DialogContentText>
                            )}
                        </ActionDialog>
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
            }}
        </TypedSaleBulkDelete>
    );
};
export default SaleList;
