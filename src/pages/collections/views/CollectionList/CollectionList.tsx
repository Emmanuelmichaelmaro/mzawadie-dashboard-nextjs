// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialogFormData,
    SaveFilterTabDialog,
} from "@mzawadie/components/SaveFilterTabDialog";
import { commonMessages } from "@mzawadie/core";
import { maybe } from "@mzawadie/core";
import { ListViews } from "@mzawadie/core";
import { useCollectionBulkDeleteMutation, useCollectionListQuery } from "@mzawadie/graphql";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState, PaginatorContext } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CollectionListPage from "../../components/CollectionListPage/CollectionListPage";
import { collectionListUrl, CollectionListUrlDialog, CollectionListUrlQueryParams } from "../../urls";
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

interface CollectionListProps {
    params: CollectionListUrlQueryParams;
}

export const CollectionList: React.FC<CollectionListProps> = ({ params }) => {
    const navigate = useNavigator();
    const intl = useIntl();
    const notify = useNotifier();

    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const { updateListSettings, settings } = useListSettings(ListViews.COLLECTION_LIST);

    usePaginationReset(collectionListUrl, params, settings.rowNumber);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: collectionListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const { availableChannels } = useAppChannel(false);

    const channelOpts = availableChannels
        ? mapNodeToChoice(availableChannels, (channel) => channel.slug)
        : null;

    const selectedChannel = availableChannels.find((channel) => channel.slug === params.channel);

    const paginationState = createPaginationState(settings.rowNumber, params);

    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
            channel: selectedChannel?.slug,
        }),
        [params, settings.rowNumber]
    );

    const { data, loading, refetch } = useCollectionListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const [collectionBulkDelete, collectionBulkDeleteOpts] = useCollectionBulkDeleteMutation({
        onCompleted: (data) => {
            if (data.collectionBulkDelete?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                refetch();
                reset();
                closeModal();
            }
        },
    });

    const filterOpts = getFilterOpts(params, channelOpts);

    const tabs = getFilterTabs();

    useEffect(() => {
        if (!canBeSorted(params.sort, !!selectedChannel)) {
            navigate(
                collectionListUrl({
                    ...params,
                    sort: DEFAULT_SORT_KEY,
                })
            );
        }
    }, [params]);

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [openModal, closeModal] = createDialogActionHandlers<
        CollectionListUrlDialog,
        CollectionListUrlQueryParams
    >(navigate, collectionListUrl, params);

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            collectionListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(collectionListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const paginationValues = usePaginator({
        pageInfo: maybe(() => data?.collections?.pageInfo),
        paginationState,
        queryString: params,
    });

    const handleSort = createSortHandler(navigate, collectionListUrl, params);

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <CollectionListPage
                currentTab={currentTab}
                initialSearch={params.query || ""}
                onSearchChange={handleSearchChange}
                onAll={resetFilters}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                tabs={tabs.map((tab) => tab.name)}
                disabled={loading}
                collections={mapEdgesToItems(data?.collections)}
                settings={settings}
                onSort={handleSort}
                onUpdateListSettings={updateListSettings}
                sort={getSortParams(params)}
                toolbar={
                    <IconButton
                        variant="secondary"
                        color="primary"
                        data-test-id="delete-icon"
                        onClick={() =>
                            openModal("remove", {
                                ids: listElements,
                            })
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                }
                isChecked={isSelected}
                selected={listElements.length}
                toggle={toggle}
                toggleAll={toggleAll}
                selectedChannelId={selectedChannel?.id}
                filterOpts={filterOpts}
                onFilterChange={changeFilters}
            />

            <ActionDialog
                open={params.action === "remove" && maybe(() => params.ids.length > 0)}
                onClose={closeModal}
                confirmButtonState={collectionBulkDeleteOpts.status}
                onConfirm={() =>
                    collectionBulkDelete({
                        variables: {
                            ids: params.ids,
                        },
                    })
                }
                variant="delete"
                title={intl.formatMessage({
                    id: "Ykw8k5",
                    defaultMessage: "Delete collections",
                    description: "dialog title",
                })}
            >
                <DialogContentText>
                    <FormattedMessage
                        id="yT5zvU"
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this collection?} other{Are you sure you want to delete {displayQuantity} collections?}}"
                        values={{
                            counter: maybe(() => params.ids.length),
                            displayQuantity: <strong>{maybe(() => params.ids.length)}</strong>,
                        }}
                    />
                </DialogContentText>
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
        </PaginatorContext.Provider>
    );
};

export default CollectionList;
