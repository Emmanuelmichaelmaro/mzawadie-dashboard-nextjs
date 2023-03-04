// @ts-nocheck
import { Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { FilterBar } from "@mzawadie/components/FilterBar";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { RefreshLimits_shop_limits } from "@mzawadie/components/Shop/types/RefreshLimits";
import {
    sectionNames,
    FilterPageProps,
    ListActions,
    PageListProps,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { OrderDraftListUrlSortField } from "@mzawadie/pages/orders/urls";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderDraftList_draftOrders_edges_node } from "../../types/OrderDraftList";
import { OrderDraftList } from "../OrderDraftList";
import OrderLimitReached from "../OrderLimitReached";
import { createFilterStructure, OrderDraftFilterKeys, OrderDraftListFilterOpts } from "./filters";

export interface OrderDraftListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<OrderDraftFilterKeys, OrderDraftListFilterOpts>,
        SortPage<OrderDraftListUrlSortField>,
        TabPageProps {
    limits: RefreshLimits_shop_limits;
    orders: OrderDraftList_draftOrders_edges_node[];
}

const OrderDraftListPage: React.FC<OrderDraftListPageProps> = ({
    currentTab,
    disabled,
    filterOpts,
    initialSearch,
    limits,
    onAdd,
    onAll,
    onFilterChange,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    tabs,
    ...listProps
}) => {
    const intl = useIntl();
    const structure = createFilterStructure(intl, filterOpts);
    const limitsReached = isLimitReached(limits, "orders");

    return (
        <Container>
            <PageHeader
                title={intl.formatMessage(sectionNames.draftOrders)}
                limitText={
                    hasLimits(limits, "orders") &&
                    intl.formatMessage(
                        {
                            defaultMessage: "{count}/{max} orders",
                            id: "w2eTzO",
                            description: "placed orders counter",
                        },
                        {
                            count: limits.currentUsage.orders,
                            max: limits.allowedUsage.orders,
                        }
                    )
                }
            >
                <Button variant="primary" disabled={disabled || limitsReached} onClick={onAdd}>
                    <FormattedMessage defaultMessage="Create order" id="LshEVn" description="button" />
                </Button>
            </PageHeader>

            {limitsReached && <OrderLimitReached />}

            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Drafts",
                        id: "7a1S4K",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Draft",
                        id: "NJEe12",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <OrderDraftList disabled={disabled} {...listProps} />
            </Card>
        </Container>
    );
};

OrderDraftListPage.displayName = "OrderDraftListPage";

export default OrderDraftListPage;
