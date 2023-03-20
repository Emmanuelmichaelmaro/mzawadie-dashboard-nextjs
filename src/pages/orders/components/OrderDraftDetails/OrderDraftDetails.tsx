// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { maybe } from "@mzawadie/core";
import { OrderDetailsFragment } from "@mzawadie/graphql";
import {
    OrderDiscountContext,
    OrderDiscountContextConsumerProps,
} from "@mzawadie/pages/products/components/OrderDiscountProviders/OrderDiscountProviders";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    OrderDraftDetailsProducts,
    FormData as OrderDraftDetailsProductsFormData,
} from "../OrderDraftDetailsProducts";
import { OrderDraftDetailsSummary } from "../OrderDraftDetailsSummary";

interface OrderDraftDetailsProps {
    order: OrderDetailsFragment;
    onOrderLineAdd: () => void;
    onOrderLineChange: (id: string, data: OrderDraftDetailsProductsFormData) => void;
    onOrderLineRemove: (id: string) => void;
    onShippingMethodEdit: () => void;
}

const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
    order,
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    onShippingMethodEdit,
}) => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Order Details",
                    id: "18wvf7",
                    description: "section header",
                })}
                toolbar={
                    order?.channel.isActive && (
                        <Button
                            variant="tertiary"
                            onClick={onOrderLineAdd}
                            data-test-id="add-products-button"
                        >
                            <FormattedMessage
                                defaultMessage="Add products"
                                id="C50ahv"
                                description="button"
                            />
                        </Button>
                    )
                }
            />

            <OrderDraftDetailsProducts
                lines={maybe(() => order.lines)}
                onOrderLineChange={onOrderLineChange}
                onOrderLineRemove={onOrderLineRemove}
            />

            {maybe(() => order.lines.length) !== 0 && (
                <CardContent>
                    <OrderDiscountContext.Consumer>
                        {(orderDiscountProps: OrderDiscountContextConsumerProps) => (
                            <OrderDraftDetailsSummary
                                order={order}
                                onShippingMethodEdit={onShippingMethodEdit}
                                {...orderDiscountProps}
                            />
                        )}
                    </OrderDiscountContext.Consumer>
                </CardContent>
            )}
        </Card>
    );
};

OrderDraftDetails.displayName = "OrderDraftDetails";

export default OrderDraftDetails;
