// @ts-nocheck
import { Card } from "@material-ui/core";
import { CardMenu } from "@mzawadie/components/CardMenu";
import Container from "@mzawadie/components/Container";
import { FilterBar } from "@mzawadie/components/FilterBar";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { sectionNames, FilterPageProps, PageListProps, SortPage, RelayToFlat } from "@mzawadie/core";
import { OrderListQuery, RefreshLimitsQuery } from "@mzawadie/graphql";
import { OrderList } from "@mzawadie/pages/orders/components/OrderList";
import { OrderListUrlSortField } from "@mzawadie/pages/orders/urls";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderLimitReached from "../OrderLimitReached";
import { createFilterStructure, OrderFilterKeys, OrderListFilterOpts } from "./filters";

export interface OrderListPageProps
    extends PageListProps,
        FilterPageProps<OrderFilterKeys, OrderListFilterOpts>,
        SortPage<OrderListUrlSortField> {
    limits: RefreshLimitsQuery["shop"]["limits"];
    orders: RelayToFlat<OrderListQuery["orders"]>;
    onSettingsOpen: () => void;
}

const useStyles = makeStyles(
    (theme) => ({
        settings: {
            marginRight: theme.spacing(2),
        },
    }),
    { name: "OrderListPage" }
);

const OrderListPage: React.FC<OrderListPageProps> = ({
    currentTab,
    initialSearch,
    filterOpts,
    limits,
    tabs,
    onAdd,
    onAll,
    onSearchChange,
    onSettingsOpen,
    onFilterChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    ...listProps
}) => {
    const intl = useIntl();
    const classes = useStyles({});
    const filterStructure = createFilterStructure(intl, filterOpts);
    const limitsReached = isLimitReached(limits, "orders");

    return (
        <Container>
            <PageHeader
                title={intl.formatMessage(sectionNames.orders)}
                limitText={
                    hasLimits(limits, "orders") &&
                    intl.formatMessage(
                        {
                            defaultMessage: "{count}/{max} orders",
                            id: "zyceue",
                            description: "placed order counter",
                        },
                        {
                            count: limits.currentUsage.orders,
                            max: limits.allowedUsage.orders,
                        }
                    )
                }
                cardMenu={
                    !!onSettingsOpen && (
                        <CardMenu
                            className={classes.settings}
                            menuItems={[
                                {
                                    label: intl.formatMessage({
                                        defaultMessage: "Order Settings",
                                        id: "WbV1Xm",
                                        description: "button",
                                    }),
                                    onSelect: onSettingsOpen,
                                },
                            ]}
                        />
                    )
                }
            >
                <Button
                    disabled={limitsReached}
                    variant="primary"
                    onClick={onAdd}
                    data-test-id="create-order-button"
                >
                    <FormattedMessage defaultMessage="Create order" id="LshEVn" description="button" />
                </Button>
            </PageHeader>

            {limitsReached && <OrderLimitReached />}

            <Card>
                <FilterBar
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                    tabs={tabs}
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Orders",
                        id: "WRkCFt",
                        description: "tab name",
                    })}
                    filterStructure={filterStructure}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Orders...",
                        id: "wTHjt3",
                    })}
                />
                <OrderList {...listProps} />
            </Card>
        </Container>
    );
};

OrderListPage.displayName = "OrderListPage";

export default OrderListPage;
