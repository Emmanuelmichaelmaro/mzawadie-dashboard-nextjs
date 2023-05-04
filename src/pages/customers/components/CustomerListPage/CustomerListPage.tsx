// @ts-nocheck
import { Card } from "@material-ui/core";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import { FilterBar } from "@mzawadie/components/FilterBar";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { sectionNames } from "@mzawadie/core";
import {
    FilterPageProps,
    ListActions,
    PageListProps,
    RelayToFlat,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { ListCustomersQuery } from "@mzawadie/graphql";
import { useUserPermissions } from "@mzawadie/pages/auth/hooks/useUserPermissions";
import { customerAddUrl, CustomerListUrlSortField } from "@mzawadie/pages/customers/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CustomerList from "../CustomerList/CustomerList";
import { createFilterStructure, CustomerFilterKeys, CustomerListFilterOpts } from "./filters";

export interface CustomerListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<CustomerFilterKeys, CustomerListFilterOpts>,
        SortPage<CustomerListUrlSortField>,
        TabPageProps {
    customers: RelayToFlat<ListCustomersQuery["customers"]>;
}

const CustomerListPage: React.FC<CustomerListPageProps> = ({
    currentTab,
    filterOpts,
    initialSearch,
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

    const userPermissions = useUserPermissions();
    
    const structure = createFilterStructure(intl, filterOpts, userPermissions);

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.customers)}>
                <Button variant="primary" href={customerAddUrl} data-test-id="create-customer">
                    <FormattedMessage
                        id="QLVddq"
                        defaultMessage="Create customer"
                        description="button"
                    />
                </Button>
            </PageHeader>
    
            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        id: "xQK2EC",
                        defaultMessage: "All Customers",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        id: "2mRLis",
                        defaultMessage: "Search Customer",
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
