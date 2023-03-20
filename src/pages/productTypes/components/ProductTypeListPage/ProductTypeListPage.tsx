// @ts-nocheck
import { Card } from "@material-ui/core";
import { Container, FilterBar, PageHeader } from "@mzawadie/components";
import {
    sectionNames,
    FilterPageProps,
    ListActions,
    PageListProps,
    SortPage,
    TabPageProps,
} from "@mzawadie/core";
import { ProductTypeFragment } from "@mzawadie/graphql";
import { ProductTypeListUrlSortField } from "@mzawadie/pages/productTypes/urls";
import { Backlink, Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductTypeList from "../ProductTypeList/ProductTypeList";
import { createFilterStructure, ProductTypeFilterKeys, ProductTypeListFilterOpts } from "./filters";

export interface ProductTypeListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<ProductTypeFilterKeys, ProductTypeListFilterOpts>,
        SortPage<ProductTypeListUrlSortField>,
        TabPageProps {
    productTypes: ProductTypeFragment[];
    onBack: () => void;
}

const ProductTypeListPage: React.FC<ProductTypeListPageProps> = ({
    currentTab,
    filterOpts,
    initialSearch,
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

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>

            <PageHeader title={intl.formatMessage(sectionNames.productTypes)}>
                <Button variant="primary" onClick={onAdd} data-test-id="add-product-type">
                    <FormattedMessage
                        defaultMessage="create product type"
                        id="QY7FSs"
                        description="button"
                    />
                </Button>
            </PageHeader>

            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Product Types",
                        id: "1KSqnn",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Product Type",
                        id: "rpFdD1",
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
