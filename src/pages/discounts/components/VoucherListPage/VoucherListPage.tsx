// @ts-nocheck
import { Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { getByName } from "@mzawadie/components/Filter/utils";
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
import { VoucherFragment } from "@mzawadie/graphql";
import { VoucherListUrlSortField } from "@mzawadie/pages/discounts/urls";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherList } from "../VoucherList";
import { createFilterStructure, VoucherFilterKeys, VoucherListFilterOpts } from "./filters";

export interface VoucherListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<VoucherFilterKeys, VoucherListFilterOpts>,
        SortPage<VoucherListUrlSortField>,
        TabPageProps,
        ChannelProps {
    vouchers: VoucherFragment[];
}

const VoucherListPage: React.FC<VoucherListPageProps> = ({
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

    const filterDependency = structure.find(getByName("channel"));

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.vouchers)}>
                <Button onClick={onAdd} variant="primary" data-test-id="create-voucher">
                    <FormattedMessage
                        defaultMessage="Create voucher"
                        id="GbhZJ4"
                        description="button"
                    />
                </Button>
            </PageHeader>

            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Vouchers",
                        id: "pNrF72",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Voucher",
                        id: "IruP2T",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <VoucherList filterDependency={filterDependency} {...listProps} />
            </Card>
        </Container>
    );
};

VoucherListPage.displayName = "VoucherListPage";

export default VoucherListPage;
