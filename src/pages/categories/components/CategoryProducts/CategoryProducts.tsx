// @ts-nocheck
import { Button, Card } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { ChannelProps, ListActions, PageListProps } from "@mzawadie/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryDetails_category_products_edges_node } from "../../types/CategoryDetails";
import { CategoryProductList } from "../CategoryProductList";

interface CategoryProductsProps extends PageListProps, ListActions, ChannelProps {
    products: CategoryDetails_category_products_edges_node[];
    channelChoices: SingleAutocompleteChoiceType[];
    channelsCount: number;
    categoryName: string;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
    channelsCount,
    products,
    disabled,
    pageInfo,
    onAdd,
    onNextPage,
    onPreviousPage,
    onRowClick,
    categoryName,
    isChecked,
    selected,
    selectedChannelId,
    toggle,
    toggleAll,
    toolbar,
}) => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage(
                    {
                        defaultMessage: "Products in {categoryName}",
                        id: "+43JV5",
                        description: "header",
                    },
                    { categoryName }
                )}
                toolbar={
                    <Button color="primary" variant="text" onClick={onAdd} data-test-id="addProducts">
                        <FormattedMessage
                            defaultMessage="Add product"
                            id="x/pIZ9"
                            description="button"
                        />
                    </Button>
                }
            />

            <CategoryProductList
                channelsCount={channelsCount}
                selectedChannelId={selectedChannelId}
                products={products}
                disabled={disabled}
                pageInfo={pageInfo}
                onNextPage={onNextPage}
                onPreviousPage={onPreviousPage}
                onRowClick={onRowClick}
                selected={selected}
                isChecked={isChecked}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={toolbar}
            />
        </Card>
    );
};

CategoryProducts.displayName = "CategoryProducts";

export default CategoryProducts;
