// @ts-nocheck
import { Card, CardContent } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { RadioGroupField } from "@mzawadie/components/RadioGroupField";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderRefundFormData, OrderRefundType } from "../OrderRefundPage/form";

const useStyles = makeStyles(
    {
        cartContent: { paddingBottom: 0 },
    },
    { name: "OrderRefund" }
);

interface OrderRefundProps {
    data: OrderRefundFormData;
    disabled: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const messages = defineMessages({
    refundMiscellaneous: {
        defaultMessage: "Miscellaneous Refund",
        id: "LKpQYh",
        description: "refund type",
    },
    refundProducts: {
        defaultMessage: "Refund Products",
        id: "CLB1k9",
        description: "refund type",
    },
});

const OrderRefund: React.FC<OrderRefundProps> = (props) => {
    const { data, disabled, onChange } = props;
    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Refund Order",
                    id: "bqAJCT",
                    description: "section header",
                })}
            />

            <CardContent className={classes.cartContent}>
                <RadioGroupField
                    choices={[
                        {
                            label: intl.formatMessage(messages.refundProducts),
                            value: OrderRefundType.PRODUCTS,
                        },
                        {
                            label: intl.formatMessage(messages.refundMiscellaneous),
                            value: OrderRefundType.MISCELLANEOUS,
                        },
                    ]}
                    disabled={disabled}
                    name={"type" as keyof FormData}
                    value={data.type}
                    onChange={onChange}
                    variant="inline"
                />
            </CardContent>
        </Card>
    );
};

OrderRefund.displayName = "OrderRefund";

export default OrderRefund;