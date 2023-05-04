import { Card } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { SearchBar } from "@mzawadie/components/SearchBar";
import { sectionNames } from "@mzawadie/core";
import { ListActions, PageListProps, SearchPageProps, SortPage, TabPageProps } from "@mzawadie/core";
import { PageTypeFragment } from "@mzawadie/graphql";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { pageTypeAddUrl, PageTypeListUrlSortField } from "@mzawadie/pages/pageTypes/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageTypeList } from "../PageTypeList";

export interface PageTypeListPageProps
    extends PageListProps,
        ListActions,
        SearchPageProps,
        SortPage<PageTypeListUrlSortField>,
        TabPageProps {
    pageTypes: PageTypeFragment[];
}

const PageTypeListPage: React.FC<PageTypeListPageProps> = ({
    currentTab,
    initialSearch,
    onAll,
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
            <Backlink href={configurationMenuUrl}>
                {intl.formatMessage(sectionNames.configuration)}
            </Backlink>

            <PageHeader title={intl.formatMessage(sectionNames.pageTypes)}>
                <Button variant="primary" href={pageTypeAddUrl} data-test-id="create-page-type">
                    <FormattedMessage
                        id="6JlXeD"
                        defaultMessage="Create page type"
                        description="button"
                    />
                </Button>
            </PageHeader>

            <Card>
                <SearchBar
                    allTabLabel={intl.formatMessage({
                        id: "oVDZUb",
                        defaultMessage: "All Page Types",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        id: "umsU70",
                        defaultMessage: "Search Page Type",
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
