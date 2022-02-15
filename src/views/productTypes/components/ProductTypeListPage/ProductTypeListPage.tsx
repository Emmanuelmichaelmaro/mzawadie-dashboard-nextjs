// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import FilterBar from "@mzawadie/components/FilterBar";
import PageHeader from "@mzawadie/components/PageHeader";
import {
    FilterPageProps,
    ListActions,
    PageListProps,
    SortPage,
    TabPageProps,
    sectionNames,
} from "@mzawadie/core";
import { ProductTypeListUrlSortField } from "@mzawadie/views/productTypes/urls";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductTypeList_productTypes_edges_node } from "../../types/ProductTypeList";
import ProductTypeList from "../ProductTypeList";
import { createFilterStructure, ProductTypeFilterKeys, ProductTypeListFilterOpts } from "./filters";

export interface ProductTypeListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<ProductTypeFilterKeys, ProductTypeListFilterOpts>,
        SortPage<ProductTypeListUrlSortField>,
        TabPageProps {
    productTypes: ProductTypeList_productTypes_edges_node[];
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
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onAdd}
                    data-test-id="addProductType"
                >
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
