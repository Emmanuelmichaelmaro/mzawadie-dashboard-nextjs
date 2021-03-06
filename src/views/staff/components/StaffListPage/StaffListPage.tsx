// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import { Container } from "@mzawadie/components/Container";
import FilterBar from "@mzawadie/components/FilterBar";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import PageHeader from "@mzawadie/components/PageHeader";
import { RefreshLimits_shop_limits } from "@mzawadie/components/Shop/types/RefreshLimits";
import { sectionNames, FilterPageProps, ListProps, SortPage, TabPageProps } from "@mzawadie/core";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
import { StaffListUrlSortField } from "@mzawadie/views/staff/urls";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StaffList_staffUsers_edges_node } from "../../types/StaffList";
import StaffList from "../StaffList/StaffList";
import { createFilterStructure, StaffFilterKeys, StaffListFilterOpts } from "./filters";

export interface StaffListPageProps
    extends ListProps,
        FilterPageProps<StaffFilterKeys, StaffListFilterOpts>,
        SortPage<StaffListUrlSortField>,
        TabPageProps {
    limits: RefreshLimits_shop_limits;
    staffMembers: StaffList_staffUsers_edges_node[];
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
                    data-test-id="inviteStaffMember"
                    color="primary"
                    disabled={reachedLimit}
                    variant="contained"
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
