import { Card } from "@material-ui/core";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { SearchBar } from "@mzawadie/components/SearchBar";
import { sectionNames } from "@mzawadie/core";
import { ListActions, PageListProps, SearchPageProps, SortPage, TabPageProps } from "@mzawadie/core";
import { CategoryFragment } from "@mzawadie/graphql";
import { categoryAddUrl, CategoryListUrlSortField } from "@mzawadie/pages/categories/urls";
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
    selected,
    settings,
    tabs,
    toggle,
    toggleAll,
    toolbar,
    onAll,
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
                <Button variant="primary" href={categoryAddUrl()} data-test-id="create-category">
                    <FormattedMessage
                        id="vof5TR"
                        defaultMessage="Create category"
                        description="button"
                    />
                </Button>
            </PageHeader>

            <Card>
                <SearchBar
                    allTabLabel={intl.formatMessage({
                        id: "vy7fjd",
                        defaultMessage: "All Categories",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        id: "JiXNEV",
                        defaultMessage: "Search Category",
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
                    isRoot={true}
                    selected={selected}
                    settings={settings}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={toolbar}
                    onUpdateListSettings={onUpdateListSettings}
                    {...listProps}
                />
            </Card>
        </Container>
    );
};

CategoryListPage.displayName = "CategoryListPage";

export default CategoryListPage;
