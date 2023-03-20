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
    RelayToFlat,
} from "@mzawadie/core";
import { ListCustomersQuery } from "@mzawadie/graphql";
import { useUser } from "@mzawadie/pages/auth";
import { useUserPermissions } from "@mzawadie/pages/auth/hooks/useUserPermissions";
import { CustomerListUrlSortField } from "@mzawadie/pages/customers/urls";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerList } from "../CustomerList";
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
	
	const userPermissions = useUserPermissions();

    const structure = createFilterStructure(intl, filterOpts, userPermissions);

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
