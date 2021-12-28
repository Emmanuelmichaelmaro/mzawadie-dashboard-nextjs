// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import { Container } from "@mzawadie/components/Container";
import FilterBar from "@mzawadie/components/FilterBar";
import PageHeader from "@mzawadie/components/PageHeader";
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
import { CollectionListUrlSortField } from "@mzawadie/views/collections/urls";
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

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.collections)}>
                <Button
                    color="primary"
                    disabled={disabled}
                    variant="contained"
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
                    channelsCount={channelsCount}
                    selectedChannelId={selectedChannelId}
                    {...listProps}
                />
            </Card>
        </Container>
    );
};

CollectionListPage.displayName = "CollectionListPage";

export default CollectionListPage;
