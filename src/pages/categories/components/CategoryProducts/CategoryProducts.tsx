// @ts-nocheck
import { Card } from "@material-ui/core";
import { Button } from "@mzawadie/components/Button";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { InternalLink } from "@mzawadie/components/InternalLink";
import { ListActions, PageListProps, RelayToFlat } from "@mzawadie/core";
import { CategoryDetailsQuery } from "@mzawadie/graphql";
import { HorizontalSpacer } from "@mzawadie/pages/apps/components/HorizontalSpacer";
import { productAddUrl, productListUrl } from "@mzawadie/pages/products/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryProductList } from "../CategoryProductList";
import { useStyles } from "./styles";

interface CategoryProductsProps extends PageListProps, ListActions {
    products: RelayToFlat<CategoryDetailsQuery["category"]["products"]>;
    categoryName: string;
    categoryId: string;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
    products,
    disabled,
    categoryId,
    categoryName,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
}) => {
    const intl = useIntl();
    const classes = useStyles();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage(
                    {
                        id: "+43JV5",
                        defaultMessage: "Products in {categoryName}",
                        description: "header",
                    },
                    { categoryName }
                )}
                toolbar={
                    <div className={classes.toolbar}>
                        <InternalLink
                            to={productListUrl({
                                categories: [categoryId],
                            })}
                        >
                            <Button variant="tertiary" data-test-id="view-products">
                                <FormattedMessage
                                    id="z8jo8h"
                                    defaultMessage="View products"
                                    description="button"
                                />
                            </Button>
                        </InternalLink>

                        <HorizontalSpacer />

                        <Button variant="tertiary" href={productAddUrl()} data-test-id="add-products">
                            <FormattedMessage
                                id="x/pIZ9"
                                defaultMessage="Add product"
                                description="button"
                            />
                        </Button>
                    </div>
                }
            />

            <CategoryProductList
                products={products}
                disabled={disabled}
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
