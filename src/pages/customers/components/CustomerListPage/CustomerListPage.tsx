// @ts-nocheck
import { Card } from "@material-ui/core";
import { Container, FilterBar, PageHeader } from "@mzawadie/components";
import {
    sectionNames,
    FilterPageProps,
    ListActions,
    PageListProps,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { CustomerListUrlSortField } from "@mzawadie/pages/customers/urls";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListCustomers_customers_edges_node } from "../../types/ListCustomers";
import { CustomerList } from "../CustomerList";
import { createFilterStructure, CustomerFilterKeys, CustomerListFilterOpts } from "./filters";

export interface CustomerListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<CustomerFilterKeys, CustomerListFilterOpts>,
        SortPage<CustomerListUrlSortField>,
        TabPageProps {
    customers: ListCustomers_customers_edges_node[];
}

const CustomerListPage: React.FC<CustomerListPageProps> = ({
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
    ...customerListProps
}) => {
    const intl = useIntl();

    const structure = createFilterStructure(intl, filterOpts);

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.customers)}>
                <Button variant="primary" onClick={onAdd} data-test-id="create-customer">
                    <FormattedMessage
                        defaultMessage="Create customer"
                        id="QLVddq"
                        description="button"
                    />
                </Button>
            </PageHeader>
            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Customers",
                        id: "xQK2EC",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Customer",
                        id: "2mRLis",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <CustomerList {...customerListProps} />
            </Card>
        </Container>
    );
};

CustomerListPage.displayName = "CustomerListPage";

export default CustomerListPage;
