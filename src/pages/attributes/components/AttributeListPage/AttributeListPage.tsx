// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { FilterBar } from "@mzawadie/components/FilterBar";
import { PageHeader } from "@mzawadie/components/PageHeader";
import {
    FilterPageProps,
    ListActions,
    PageListProps,
    SortPage,
    TabPageProps,
    sectionNames,
} from "@mzawadie/core";
import { AttributeFragment } from "@mzawadie/graphql";
import { AttributeListUrlSortField } from "@mzawadie/pages/attributes/urls";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AttributeList } from "../AttributeList";
import { AttributeFilterKeys, AttributeListFilterOpts, createFilterStructure } from "./filters";

export interface AttributeListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<AttributeFilterKeys, AttributeListFilterOpts>,
        SortPage<AttributeListUrlSortField>,
        TabPageProps {
    attributes: AttributeFragment[];
    onBack: () => void;
}

const AttributeListPage: React.FC<AttributeListPageProps> = ({
    filterOpts,
    initialSearch,
    onAdd,
    onBack,
    onFilterChange,
    onSearchChange,
    currentTab,
    onAll,
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
            <Backlink onClick={onBack}>
                <FormattedMessage {...sectionNames.configuration} />
            </Backlink>
            <PageHeader title={intl.formatMessage(sectionNames.attributes)}>
                <Button
                    onClick={onAdd}
                    color="primary"
                    variant="contained"
                    data-test-id="createAttributeButton"
                >
                    <FormattedMessage
                        defaultMessage="Create attribute"
                        id="IGvQ8k"
                        description="button"
                    />
                </Button>
            </PageHeader>
            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Attributes",
                        id: "dKPMyh",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Attribute",
                        id: "1div9r",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <AttributeList {...listProps} />
            </Card>
        </Container>
    );
};
AttributeListPage.displayName = "AttributeListPage";
export default AttributeListPage;
