// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialog,
    SaveFilterTabDialogFormData,
} from "@mzawadie/components/SaveFilterTabDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, sectionNames, maybe, ListViews } from "@mzawadie/core";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import { VoucherListPage } from "@mzawadie/pages/discounts/components/VoucherListPage";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TypedVoucherBulkDelete } from "../../mutations";
import { useVoucherListQuery } from "../../queries";
import { VoucherBulkDelete } from "../../types/VoucherBulkDelete";
import {
    voucherAddUrl,
    voucherListUrl,
    VoucherListUrlDialog,
    VoucherListUrlQueryParams,
    voucherUrl,
} from "../../urls";
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
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface VoucherListProps {
    params: VoucherListUrlQueryParams;
}

export const VoucherList: React.FC<VoucherListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const paginate = usePaginator();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const { updateListSettings, settings } = useListSettings(ListViews.VOUCHER_LIST);

    usePaginationReset(voucherListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const { availableChannels } = useAppChannel(false);
    const selectedChannel = availableChannels.find((channel) => channel.slug === params.channel);
    const channelOpts = availableChannels
        ? mapNodeToChoice(availableChannels, (channel) => channel.slug)
        : null;

    const [openModal, closeModal] = createDialogActionHandlers<
        VoucherListUrlDialog,
        VoucherListUrlQueryParams
    >(navigate, voucherListUrl, params);

    const paginationState = createPaginationState(settings.rowNumber, params);
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
            channel: params.channel,
        }),
        [params, settings.rowNumber]
    );
    const { data, loading, refetch } = useVoucherListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: voucherListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    useEffect(() => {
        if (!canBeSorted(params.sort, !!selectedChannel)) {
            navigate(
                voucherListUrl({
                    ...params,
                    sort: DEFAULT_SORT_KEY,
                })
            );
        }
    }, [params]);

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            voucherListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(voucherListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        data?.vouchers?.pageInfo,
        paginationState,
        params
    );

    const handleVoucherBulkDelete = (data: VoucherBulkDelete) => {
        if (data.voucherBulkDelete.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            reset();
            closeModal();
            refetch();
        }
    };

    const handleSort = createSortHandler(navigate, voucherListUrl, params);

    return (
        <TypedVoucherBulkDelete onCompleted={handleVoucherBulkDelete}>
            {(voucherBulkDelete, voucherBulkDeleteOpts) => {
                const onVoucherBulkDelete = () =>
                    voucherBulkDelete({
                        variables: {
                            ids: params.ids,
                        },
                    });

                return (
                    <>
                        <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
                        <VoucherListPage
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
                            settings={settings}
                            vouchers={mapEdgesToItems(data?.vouchers)}
                            disabled={loading}
                            pageInfo={pageInfo}
                            onAdd={() => navigate(voucherAddUrl())}
                            onNextPage={loadNextPage}
                            onPreviousPage={loadPreviousPage}
                            onUpdateListSettings={updateListSettings}
                            onRowClick={(id) => () => navigate(voucherUrl(id))}
                            onSort={handleSort}
                            isChecked={isSelected}
                            selected={listElements.length}
                            sort={getSortParams(params)}
                            toggle={toggle}
                            toggleAll={toggleAll}
                            toolbar={
                                <IconButton
                                    variant="secondary"
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
                            confirmButtonState={voucherBulkDeleteOpts.status}
                            onClose={closeModal}
                            onConfirm={onVoucherBulkDelete}
                            open={params.action === "remove" && canOpenBulkActionDialog}
                            title={intl.formatMessage({
                                defaultMessage: "Delete Vouchers",
                                id: "Q0JJ4F",
                                description: "dialog header",
                            })}
                            variant="delete"
                        >
                            {canOpenBulkActionDialog && (
                                <DialogContentText>
                                    <FormattedMessage
                                        defaultMessage="{counter,plural,one{Are you sure you want to delete this voucher?} other{Are you sure you want to delete {displayQuantity} vouchers?}}"
                                        id="O9QPe1"
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
        </TypedVoucherBulkDelete>
    );
};

export default VoucherList;
