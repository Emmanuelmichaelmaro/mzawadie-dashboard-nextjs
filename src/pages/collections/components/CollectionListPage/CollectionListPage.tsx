// @ts-nocheck
import { Card } from "@material-ui/core";
import { Container } from "@mzawadie/components/Container";
import { getByName } from "@mzawadie/components/Filter/utils";
import { FilterBar } from "@mzawadie/components/FilterBar";
import { PageHeader } from "@mzawadie/components/PageHeader";
import {
    sectionNames,
    ChannelProps,
    FilterPageProps,
    ListActions,
    PageListProps,
    SearchPageProps,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { CollectionListUrlSortField } from "@mzawadie/pages/collections/urls";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CollectionList_collections_edges_node } from "../../types/CollectionList";
import CollectionList from "../CollectionList/CollectionList";
import { CollectionFilterKeys, CollectionListFilterOpts, createFilterStructure } from "./filters";

export interface CollectionListPageProps
    extends PageListProps,
        ListActions,
        SearchPageProps,
        SortPage<CollectionListUrlSortField>,
        TabPageProps,
        FilterPageProps<CollectionFilterKeys, CollectionListFilterOpts>,
        ChannelProps {
    collections: CollectionList_collections_edges_node[];
    channelsCount: number;
}

const CollectionListPage: React.FC<CollectionListPageProps> = ({
    channelsCount,
    currentTab,
    disabled,
    initialSearch,
    onAdd,
    onAll,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    selectedChannelId,
    tabs,
    filterOpts,
    onFilterChange,
    onFilterAttributeFocus,
    ...listProps
}) => {
    const intl = useIntl();
    const filterStructure = createFilterStructure(intl, filterOpts);

    const filterDependency = filterStructure.find(getByName("channel"));

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.collections)}>
                <Button
                    disabled={disabled}
                    variant="primary"
                    onClick={onAdd}
                    data-test-id="create-collection"
                >
                    <FormattedMessage
                        defaultMessage="Create collection"
                        id="jyaAlB"
                        description="button"
                    />
                </Button>
            </PageHeader>
            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Collections",
                        id: "G4g5Ii",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={filterStructure}
                    initialSearch={initialSearch}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onFilterAttributeFocus={onFilterAttributeFocus}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Collections",
                        id: "s97tLq",
                    })}
                    tabs={tabs}
                />
                <CollectionList
                    disabled={disabled}
                    selectedChannelId={selectedChannelId}
                    filterDependency={filterDependency}
                    {...listProps}
                />
            </Card>
        </Container>
    );
};

CollectionListPage.displayName = "CollectionListPage";

export default CollectionListPage;