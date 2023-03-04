import { Money } from "@mzawadie/fragments/types/Money";
import { OrderDiscountCommonInput } from "@mzawadie/pages/orders/components/OrderDiscountCommonModal/types";
import { OrderDetails_order_lines_undiscountedUnitPrice } from "@mzawadie/pages/orders/types/OrderDetails";

import { OrderLineDiscountContextConsumerProps } from "./OrderLineDiscountProviders";

export interface OrderDiscountData extends OrderDiscountCommonInput {
    amount: Money;
}

export type GetOrderLineDiscountContextConsumerProps = (
    orderLineId: string
) => OrderLineDiscountContextConsumerProps;

export interface OrderLineDiscountData extends OrderDiscountCommonInput {
    moneyValue: Money;
    undiscountedPrice: OrderDetails_order_lines_undiscountedUnitPrice;
}

export interface OrderDiscountConsumerCommonProps {
    openDialog: () => void;
    closeDialog: () => void;
    isDialogOpen: boolean;
    undiscountedPrice: Money;
    discountedPrice: Money;
}

export interface OrderLineDiscountConsumerProps {
    children: (values: OrderLineDiscountContextConsumerProps) => React.ReactNode;
    orderLineId: string;
}
