// @ts-nocheck
import { Card } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import {FilterBar} from "@mzawadie/components/FilterBar";
import {PageHeader} from "@mzawadie/components/PageHeader";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { sectionNames } from "@mzawadie/core";
import { FilterPageProps, ListActions, PageListProps, SortPage, TabPageProps } from "@mzawadie/core";
import { ProductTypeFragment } from "@mzawadie/graphql";
import { productTypeAddUrl, ProductTypeListUrlSortField } from "@mzawadie/pages/productTypes/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductTypeList } from "../ProductTypeList";
import { createFilterStructure, ProductTypeFilterKeys, ProductTypeListFilterOpts } from "./filters";

export interface ProductTypeListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<ProductTypeFilterKeys, ProductTypeListFilterOpts>,
        SortPage<ProductTypeListUrlSortField>,
        TabPageProps {
    productTypes: ProductTypeFragment[];
}

const ProductTypeListPage: React.FC<ProductTypeListPageProps> = ({
    currentTab,
    filterOpts,
    initialSearch,
    onAll,
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

    return (
        <Container>
            <Backlink href={configurationMenuUrl}>
                {intl.formatMessage(sectionNames.configuration)}
            </Backlink>

            <PageHeader title={intl.formatMessage(sectionNames.productTypes)}>
                <Button variant="primary" href={productTypeAddUrl()} data-test-id="add-product-type">
                    <FormattedMessage
                        id="QY7FSs"
                        defaultMessage="create product type"
                        description="button"
                    />
                </Button>
            </PageHeader>

            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        id: "1KSqnn",
                        defaultMessage: "All Product Types",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        id: "rpFdD1",
                        defaultMessage: "Search Product Type",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <ProductTypeList {...listProps} />
            </Card>
        </Container>
    );
};

ProductTypeListPage.displayName = "ProductTypeListPage";

export default ProductTypeListPage;
