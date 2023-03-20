// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { FilterBar } from "@mzawadie/components/FilterBar";
import { PageHeader } from "@mzawadie/components/PageHeader";
import {
    sectionNames,
    ChannelProps,
    FilterPageProps,
    ListActions,
    PageListProps,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { SaleFragment } from "@mzawadie/graphql";
import { SaleListUrlSortField } from "@mzawadie/pages/discounts/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleList } from "../SaleList";
import { createFilterStructure, SaleFilterKeys, SaleListFilterOpts } from "./filters";

export interface SaleListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<SaleFilterKeys, SaleListFilterOpts>,
        SortPage<SaleListUrlSortField>,
        TabPageProps,
        ChannelProps {
    sales: SaleFragment[];
}

const SaleListPage: React.FC<SaleListPageProps> = ({
    currentTab,
    filterOpts,
    initialSearch,
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

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.sales)}>
                <Button onClick={onAdd} variant="contained" color="primary" data-test-id="create-sale">
                    <FormattedMessage defaultMessage="Create Sale" id="JHfbXR" description="button" />
                </Button>
            </PageHeader>
            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Sales",
                        id: "Yjhgle",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Sale",
                        id: "MSD3A/",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <SaleList {...listProps} />
            </Card>
        </Container>
    );
};

SaleListPage.displayName = "SaleListPage";

export default SaleListPage;
