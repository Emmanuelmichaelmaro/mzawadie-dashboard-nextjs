// @ts-nocheck
import { Typography } from "@material-ui/core";
import DiscountedPrice from "@mzawadie/components/DiscountedPrice/DiscountedPrice";
import { Money } from "@mzawadie/components/Money";
import { SearchOrderVariant_search_edges_node_variants_pricing } from "@mzawadie/pages/orders/types/SearchOrderVariant";
import * as React from "react";

import { useStyles } from "./styles";

interface OrderPriceLabelProps {
    pricing: SearchOrderVariant_search_edges_node_variants_pricing;
}

const OrderPriceLabel: React.FC<OrderPriceLabelProps> = ({ pricing }) => {
    const classes = useStyles();

    if (pricing.onSale) {
        const { price, priceUndiscounted } = pricing;
        return (
            <div className={classes.percentDiscountLabelContainer}>
                <DiscountedPrice
                    discountedPrice={price?.gross}
                    regularPrice={priceUndiscounted?.gross}
                />
            </div>
        );
    }

    return (
        <Typography align="right">
            <Money money={pricing.priceUndiscounted?.gross} />
        </Typography>
    );
};

export default OrderPriceLabel;
