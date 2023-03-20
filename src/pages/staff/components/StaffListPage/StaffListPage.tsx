// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import { Container } from "@mzawadie/components/Container";
import { FilterBar } from "@mzawadie/components/FilterBar";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import { PageHeader } from "@mzawadie/components/PageHeader";
import {
    sectionNames,
    FilterPageProps,
    ListProps,
    SortPage,
    TabPageProps,
    RelayToFlat,
} from "@mzawadie/core";
import { RefreshLimitsQuery, StaffListQuery } from "@mzawadie/graphql";
import { StaffListUrlSortField } from "@mzawadie/pages/staff/urls";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StaffList } from "../StaffList";
import { createFilterStructure, StaffFilterKeys, StaffListFilterOpts } from "./filters";

export interface StaffListPageProps
    extends ListProps,
        FilterPageProps<StaffFilterKeys, StaffListFilterOpts>,
        SortPage<StaffListUrlSortField>,
        TabPageProps {
    limits: RefreshLimitsQuery["shop"]["limits"];
    staffMembers: RelayToFlat<StaffListQuery["staffUsers"]>;
    onAdd: () => void;
    onBack: () => void;
}

const StaffListPage: React.FC<StaffListPageProps> = ({
    currentTab,
    filterOpts,
    initialSearch,
    limits,
    onAdd,
    onAll,
    onBack,
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
    const reachedLimit = isLimitReached(limits, "staffUsers");

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>
            <PageHeader
                title={intl.formatMessage(sectionNames.staff)}
                limitText={
                    hasLimits(limits, "staffUsers") &&
                    intl.formatMessage(
                        {
                            defaultMessage: "{count}/{max} members",
                            id: "9xlPgt",
                            description: "used staff users counter",
                        },
                        {
                            count: limits.currentUsage.staffUsers,
                            max: limits.allowedUsage.staffUsers,
                        }
                    )
                }
            >
                <Button
                    data-test-id="invite-staff-member"
                    disabled={reachedLimit}
                    variant="primary"
                    onClick={onAdd}
                >
                    <FormattedMessage
                        defaultMessage="Invite staff member"
                        id="4JcNaA"
                        description="button"
                    />
                </Button>
            </PageHeader>

            {reachedLimit && (
                <LimitReachedAlert
                    title={intl.formatMessage({
                        defaultMessage: "Staff Member limit reached",
                        id: "pA8Mlv",
                        description: "alert",
                    })}
                >
                    <FormattedMessage
                        defaultMessage="You have reached your staff member limit, you will be no longer able to add staff members to your store. If you would like to up your limit, contact your administration staff about raising your limits."
                        id="OaA0f9"
                    />
                </LimitReachedAlert>
            )}

            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Staff Members",
                        id: "YJ4TXc",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Staff Member",
                        id: "aDbrOK",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <StaffList {...listProps} />
            </Card>
        </Container>
    );
};

StaffListPage.displayName = "StaffListPage";

export default StaffListPage;
