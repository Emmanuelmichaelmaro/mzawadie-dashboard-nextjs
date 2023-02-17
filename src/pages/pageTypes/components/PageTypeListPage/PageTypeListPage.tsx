import { Button, Card } from "@material-ui/core";
import { Container } from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { SearchBar } from "@mzawadie/components/SearchBar";
import {
    ListActions,
    PageListProps,
    SearchPageProps,
    sectionNames,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { PageTypeList_pageTypes_edges_node } from "@mzawadie/pages/pageTypes/types/PageTypeList";
import { PageTypeListUrlSortField } from "@mzawadie/pages/pageTypes/urls";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageTypeList } from "../PageTypeList";

export interface PageTypeListPageProps
    extends PageListProps,
        ListActions,
        SearchPageProps,
        SortPage<PageTypeListUrlSortField>,
        TabPageProps {
    pageTypes: PageTypeList_pageTypes_edges_node[];
    onBack: () => void;
}

const PageTypeListPage: React.FC<PageTypeListPageProps> = ({
    currentTab,
    initialSearch,
    onAdd,
    onAll,
    onBack,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    tabs,
    ...listProps
}) => {
    const intl = useIntl();
    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>
            <PageHeader title={intl.formatMessage(sectionNames.pageTypes)}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onAdd}
                    data-test-id="createPageType"
                >
                    <FormattedMessage
                        defaultMessage="create page type"
                        id="wtKQiW"
                        description="button"
                    />
                </Button>
            </PageHeader>
            <Card>
                <SearchBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Page Types",
                        id: "oVDZUb",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Page Type",
                        id: "umsU70",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <PageTypeList {...listProps} />
            </Card>
        </Container>
    );
};

PageTypeListPage.displayName = "PageTypeListPage";

export default PageTypeListPage;
