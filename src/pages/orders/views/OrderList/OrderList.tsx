// @ts-nocheck
import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialogFormData,
    SaveFilterTabDialog,
} from "@mzawadie/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@mzawadie/components/Shop/queries";
import { getStringOrPlaceholder } from "@mzawadie/core";
import { ListViews } from "@mzawadie/core";
import { useOrderDraftCreateMutation, useOrderListQuery } from "@mzawadie/graphql";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState, PaginatorContext } from "@mzawadie/hooks/usePaginator";
import { useSortRedirects } from "@mzawadie/hooks/useSortRedirects";
import { ChannelPickerDialog } from "@mzawadie/pages/channels/components/ChannelPickerDialog";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import OrderListPage from "../../components/OrderListPage/OrderListPage";
import {
    orderListUrl,
    OrderListUrlDialog,
    OrderListUrlQueryParams,
    OrderListUrlSortField,
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
import { DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface OrderListProps {
    params: OrderListUrlQueryParams;
}

export const OrderList: React.FC<OrderListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();

    const { updateListSettings, settings } = useListSettings(ListViews.ORDER_LIST);

    usePaginationReset(orderListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const [createOrder] = useOrderDraftCreateMutation({
        onCompleted: (data) => {
            notify({
                status: "success",
                text: intl.formatMessage({
                    id: "6udlH+",
                    defaultMessage: "Order draft successfully created",
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

    const paginationValues = usePaginator({
        pageInfo: data?.orders?.pageInfo,
        paginationState,
        queryString: params,
    });

    const handleSort = createSortHandler(navigate, orderListUrl, params);

    useSortRedirects<OrderListUrlSortField>({
        params,
        defaultSortField: DEFAULT_SORT_KEY,
        urlFunc: orderListUrl,
    });

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <OrderListPage
                settings={settings}
                currentTab={currentTab}
                disabled={loading}
                filterOpts={getFilterOpts(params, channelOpts)}
                limits={limitOpts.data?.shop.limits}
                orders={mapEdgesToItems(data?.orders)}
                sort={getSortParams(params)}
                onAdd={() => openModal("create-order")}
                onUpdateListSettings={updateListSettings}
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
                    channelsChoices={channelOpts}
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
        </PaginatorContext.Provider>
    );
};

export default OrderList;
