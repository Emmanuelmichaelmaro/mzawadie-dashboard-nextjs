// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialogFormData,
    SaveFilterTabDialog,
} from "@mzawadie/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/queries";
import { maybe, ListViews } from "@mzawadie/core";
import {
    useOrderDraftBulkCancelMutation,
    useOrderDraftCreateMutation,
    useOrderDraftListQuery,
} from "@mzawadie/graphql";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import { ChannelPickerDialog } from "@mzawadie/pages/channels/components/ChannelPickerDialog";
import { OrderDraftListPage } from "@mzawadie/pages/orders/components/OrderDraftListPage";
import {
    orderDraftListUrl,
    OrderDraftListUrlDialog,
    OrderDraftListUrlQueryParams,
    orderUrl,
} from "@mzawadie/pages/orders/urls";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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

interface OrderDraftListProps {
    params: OrderDraftListUrlQueryParams;
}

export const OrderDraftList: React.FC<OrderDraftListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const paginate = usePaginator();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const { updateListSettings, settings } = useListSettings(ListViews.DRAFT_LIST);

    usePaginationReset(orderDraftListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const [orderDraftBulkDelete, orderDraftBulkDeleteOpts] = useOrderDraftBulkCancelMutation({
        onCompleted: (data) => {
            if (data.draftOrderBulkDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Deleted draft orders",
                        id: "ra2O4j",
                    }),
                });
                refetch();
                reset();
                closeModal();
            }
        },
    });

    const [createOrder] = useOrderDraftCreateMutation({
        onCompleted: (data) => {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order draft successfully created",
                    id: "6udlH+",
                }),
            });
            navigate(orderUrl(data.draftOrderCreate.order.id));
        },
    });

    const { channel, availableChannels } = useAppChannel(false);
    const limitOpts = useShopLimitsQuery({
        variables: {
            orders: true,
        },
    });

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: orderDraftListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        OrderDraftListUrlDialog,
        OrderDraftListUrlQueryParams
    >(navigate, orderDraftListUrl, params);

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            orderDraftListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(orderDraftListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const paginationState = createPaginationState(settings.rowNumber, params);
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [params, settings.rowNumber]
    );
    const { data, loading, refetch } = useOrderDraftListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        maybe(() => data.draftOrders.pageInfo),
        paginationState,
        params
    );

    const handleSort = createSortHandler(navigate, orderDraftListUrl, params);

    const onOrderDraftBulkDelete = () =>
        orderDraftBulkDelete({
            variables: {
                ids: params.ids,
            },
        });

    return (
        <>
            <OrderDraftListPage
                currentTab={currentTab}
                filterOpts={getFilterOpts(params)}
                limits={limitOpts.data?.shop.limits}
                initialSearch={params.query || ""}
                onSearchChange={handleSearchChange}
                onFilterChange={changeFilters}
                onAll={resetFilters}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                tabs={tabs.map((tab) => tab.name)}
                disabled={loading}
                settings={settings}
                orders={mapEdgesToItems(data?.draftOrders)}
                pageInfo={pageInfo}
                onAdd={() => openModal("create-order")}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onRowClick={(id) => () => navigate(orderUrl(id))}
                onSort={handleSort}
                onUpdateListSettings={updateListSettings}
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
            />
            <ActionDialog
                confirmButtonState={orderDraftBulkDeleteOpts.status}
                onClose={closeModal}
                onConfirm={onOrderDraftBulkDelete}
                open={params.action === "remove"}
                title={intl.formatMessage({
                    defaultMessage: "Delete Order Drafts",
                    id: "qbmeUI",
                    description: "dialog header",
                })}
                variant="delete"
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this order draft?} other{Are you sure you want to delete {displayQuantity} order drafts?}}"
                        id="Q6VRrE"
                        description="dialog content"
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
            <ChannelPickerDialog
                channelsChoices={mapNodeToChoice(availableChannels)}
                confirmButtonState="success"
                defaultChoice={channel?.id}
                open={params.action === "create-order"}
                onClose={closeModal}
                onConfirm={(channelId) =>
                    createOrder({
                        variables: {
                            input: { channelId },
                        },
                    })
                }
            />
        </>
    );
};

export default OrderDraftList;
