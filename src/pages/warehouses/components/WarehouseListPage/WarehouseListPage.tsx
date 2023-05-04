// @ts-nocheck
import { Card } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { SearchBar } from "@mzawadie/components/SearchBar";
import { sectionNames } from "@mzawadie/core";
import { PageListProps, SearchPageProps, SortPage, TabPageProps } from "@mzawadie/core";
import { RefreshLimitsQuery, WarehouseWithShippingFragment } from "@mzawadie/graphql";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { warehouseAddUrl, WarehouseListUrlSortField } from "@mzawadie/pages/warehouses/urls";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
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
    onRemove: (id: string) => void;
}

export const WarehouseListPage: React.FC<WarehouseListPageProps> = ({
    warehouses,
    currentTab,
    disabled,
    limits,
    initialSearch,
    settings,
    tabs,
    onAll,
    onRemove,
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
            <Backlink href={configurationMenuUrl}>
                <FormattedMessage {...sectionNames.configuration} />
            </Backlink>

            <PageHeader
                title={intl.formatMessage(sectionNames.warehouses)}
                limitText={
                    hasLimits(limits, "warehouses") &&
                    intl.formatMessage(
                        {
                            id: "YkOzse",
                            defaultMessage: "{count}/{max} warehouses used",
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
                    data-test-id="create-warehouse"
                    disabled={limitReached}
                    variant="primary"
                    href={warehouseAddUrl}
                >
                    <FormattedMessage
                        id="wmdHhD"
                        defaultMessage="Create Warehouse"
                        description="button"
                    />
                </Button>
            </PageHeader>

            {limitReached && (
                <LimitReachedAlert
                    title={intl.formatMessage({
                        id: "5HwLx9",
                        defaultMessage: "Warehouse limit reached",
                        description: "alert",
                    })}
                >
                    <FormattedMessage
                        id="kFQvXv"
                        defaultMessage="You have reached your warehouse limit, you will be no longer able to add warehouses to your store. If you would like to up your limit, contact your administration staff about raising your limits."
                    />
                </LimitReachedAlert>
            )}

            <Card>
                <SearchBar
                    allTabLabel={intl.formatMessage({
                        id: "2yU+q9",
                        defaultMessage: "All Warehouses",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        id: "caMMWN",
                        defaultMessage: "Search Warehouse",
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
                    settings={settings}
                    onRemove={onRemove}
                    onUpdateListSettings={onUpdateListSettings}
                    {...listProps}
                />
            </Card>
        </Container>
    );
};

WarehouseListPage.displayName = "WarehouseListPage";

export default WarehouseListPage;
