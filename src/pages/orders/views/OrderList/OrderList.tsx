// @ts-nocheck
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialog,
    SaveFilterTabDialogFormData,
} from "@mzawadie/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/query";
import { getStringOrPlaceholder, ListViews } from "@mzawadie/core";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import { ChannelPickerDialog } from "@mzawadie/pages/channels/components/ChannelPickerDialog";
import { OrderListPage } from "@mzawadie/pages/orders/components/OrderListPage";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import { useOrderDraftCreateMutation } from "../../mutations";
import { useOrderListQuery } from "../../queries";
import { OrderDraftCreate } from "../../types/OrderDraftCreate";
import {
    orderListUrl,
    OrderListUrlDialog,
    OrderListUrlQueryParams,
    orderSettingsPath,
    orderUrl,
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
import { getSortQueryVariables } from "./sort";

interface OrderListProps {
    params: OrderListUrlQueryParams;
}

export const OrderList: React.FC<OrderListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const paginate = usePaginator();

    const { updateListSettings, settings } = useListSettings(ListViews.ORDER_LIST);

    usePaginationReset(orderListUrl, params, settings.rowNumber);

    const handleCreateOrderCreateSuccess = (data: OrderDraftCreate) => {
        notify({
            status: "success",
            text: intl.formatMessage({
                defaultMessage: "Order draft successfully created",
                id: "6udlH+",
            }),
        });
        navigate(orderUrl(data.draftOrderCreate.order.id));
    };

    const [createOrder] = useOrderDraftCreateMutation({
        onCompleted: handleCreateOrderCreateSuccess,
    });

    const { channel, availableChannels } = useAppChannel(false);

    const limitOpts = useShopLimitsQuery({
        variables: {
            orders: true,
        },
    });

    const noChannel = !channel && typeof channel !== "undefined";

    const channelOpts = availableChannels ? mapNodeToChoice(availableChannels) : null;

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        createUrl: orderListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        OrderListUrlDialog,
        OrderListUrlQueryParams
    >(navigate, orderListUrl, params);

    const handleTabChange = (tab: number) =>
        navigate(
            orderListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );

    const handleFilterTabDelete = () => {
        deleteFilterTab(currentTab);
        navigate(orderListUrl());
    };

    const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
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

    const { data, loading } = useOrderListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        data?.orders?.pageInfo,
        paginationState,
        params
    );

    const handleSort = createSortHandler(navigate, orderListUrl, params);

    return (
        <>
            <OrderListPage
                settings={settings}
                currentTab={currentTab}
                disabled={loading}
                filterOpts={getFilterOpts(params, channelOpts)}
                limits={limitOpts.data?.shop.limits}
                orders={mapEdgesToItems(data?.orders)}
                pageInfo={pageInfo}
                sort={getSortParams(params)}
                onAdd={() => openModal("create-order")}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onUpdateListSettings={updateListSettings}
                onRowClick={(id) => () => navigate(orderUrl(id))}
                onSort={handleSort}
                onSearchChange={handleSearchChange}
                onFilterChange={changeFilters}
                onTabSave={() => openModal("save-search")}
                onTabDelete={() => openModal("delete-search")}
                onTabChange={handleTabChange}
                initialSearch={params.query || ""}
                tabs={getFilterTabs().map((tab) => tab.name)}
                onAll={resetFilters}
                onSettingsOpen={() => navigate(orderSettingsPath)}
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
                tabName={getStringOrPlaceholder(tabs[currentTab - 1]?.name)}
            />

            {!noChannel && (
                <ChannelPickerDialog
                    channelsChoices={mapNodeToChoice(availableChannels)}
                    confirmButtonState="success"
                    defaultChoice={channel.id}
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
            )}
        </>
    );
};

export default OrderList;
