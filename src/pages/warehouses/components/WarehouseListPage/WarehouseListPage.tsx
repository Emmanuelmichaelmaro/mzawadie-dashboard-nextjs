// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { SearchBar } from "@mzawadie/components/SearchBar";
import { PageListProps, SearchPageProps, SortPage, TabPageProps, sectionNames } from "@mzawadie/core";
import { RefreshLimitsQuery, WarehouseWithShippingFragment } from "@mzawadie/graphql";
import { WarehouseListUrlSortField } from "@mzawadie/pages/warehouses/urls";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WarehouseList } from "../WarehouseList";

export interface WarehouseListPageProps
    extends PageListProps,
        SearchPageProps,
        SortPage<WarehouseListUrlSortField>,
        TabPageProps {
    limits: RefreshLimitsQuery["shop"]["limits"];
    warehouses: WarehouseWithShippingFragment[];
    onBack: () => void;
    onRemove: (id: string) => void;
}

export const WarehouseListPage: React.FC<WarehouseListPageProps> = ({
    warehouses,
    currentTab,
    disabled,
    limits,
    initialSearch,
    pageInfo,
    settings,
    tabs,
    onAdd,
    onAll,
    onBack,
    onNextPage,
    onPreviousPage,
    onRemove,
    onRowClick,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    ...listProps
}) => {
    const intl = useIntl();

    const limitReached = isLimitReached(limits, "warehouses");

    return (
        <Container>
            <Backlink onClick={onBack}>
                <FormattedMessage {...sectionNames.configuration} />
            </Backlink>

            <PageHeader
                title={intl.formatMessage(sectionNames.warehouses)}
                limitText={
                    hasLimits(limits, "warehouses") &&
                    intl.formatMessage(
                        {
                            defaultMessage: "{count}/{max} warehouses used",
                            id: "YkOzse",
                            description: "used warehouses counter",
                        },
                        {
                            count: limits.currentUsage.warehouses,
                            max: limits.allowedUsage.warehouses,
                        }
                    )
                }
            >
                <Button
                    data-test-id="createWarehouse"
                    color="primary"
                    disabled={limitReached}
                    variant="contained"
                    onClick={onAdd}
                >
                    <FormattedMessage
                        defaultMessage="Create Warehouse"
                        id="wmdHhD"
                        description="button"
                    />
                </Button>
            </PageHeader>

            {limitReached && (
                <LimitReachedAlert
                    title={intl.formatMessage({
                        defaultMessage: "Warehouse limit reached",
                        id: "5HwLx9",
                        description: "alert",
                    })}
                >
                    <FormattedMessage
                        defaultMessage="You have reached your warehouse limit, you will be no longer able to add warehouses to your store. If you would like to up your limit, contact your administration staff about raising your limits."
                        id="kFQvXv"
                    />
                </LimitReachedAlert>
            )}

            <Card>
                <SearchBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Warehouses",
                        id: "2yU+q9",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Warehouse",
                        id: "caMMWN",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />

                <WarehouseList
                    warehouses={warehouses}
                    disabled={disabled}
                    pageInfo={pageInfo}
                    settings={settings}
                    onAdd={onAdd}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    onRemove={onRemove}
                    onRowClick={onRowClick}
                    onUpdateListSettings={onUpdateListSettings}
                    {...listProps}
                />
            </Card>
        </Container>
    );
};

WarehouseListPage.displayName = "WarehouseListPage";

export default WarehouseListPage;
