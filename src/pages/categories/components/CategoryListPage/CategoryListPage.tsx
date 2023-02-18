// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { SearchBar } from "@mzawadie/components/SearchBar";
import {
    sectionNames,
    ListActions,
    PageListProps,
    SearchPageProps,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { CategoryFragment } from "@mzawadie/fragments/types/CategoryFragment";
import { CategoryListUrlSortField } from "@mzawadie/pages/categories/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryList } from "../CategoryList";

export interface CategoryTableProps
    extends PageListProps,
        ListActions,
        SearchPageProps,
        SortPage<CategoryListUrlSortField>,
        TabPageProps {
    categories: CategoryFragment[];
}

export const CategoryListPage: React.FC<CategoryTableProps> = ({
    categories,
    currentTab,
    disabled,
    initialSearch,
    isChecked,
    pageInfo,
    selected,
    settings,
    tabs,
    toggle,
    toggleAll,
    toolbar,
    onAdd,
    onAll,
    onNextPage,
    onPreviousPage,
    onRowClick,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    ...listProps
}) => {
    const intl = useIntl();

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.categories)}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onAdd}
                    data-test-id="createCategory"
                >
                    <FormattedMessage
                        defaultMessage="Create category"
                        id="vof5TR"
                        description="button"
                    />
                </Button>
            </PageHeader>

            <Card>
                <SearchBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Categories",
                        id: "vy7fjd",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Category",
                        id: "JiXNEV",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />

                <CategoryList
                    categories={categories}
                    disabled={disabled}
                    isChecked={isChecked}
                    isRoot
                    pageInfo={pageInfo}
                    selected={selected}
                    settings={settings}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                    onAdd={onAdd}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    onRowClick={onRowClick}
                    onUpdateListSettings={onUpdateListSettings}
                    {...listProps}
                />
            </Card>
        </Container>
    );
};

CategoryListPage.displayName = "CategoryListPage";

export default CategoryListPage;
