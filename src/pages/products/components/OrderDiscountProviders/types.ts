import { MoneyFragment, TaxedMoneyFragment } from "@mzawadie/graphql";
import { OrderDiscountCommonInput } from "@mzawadie/pages/orders/components/OrderDiscountCommonModal/types";

import { OrderLineDiscountContextConsumerProps } from "./OrderLineDiscountProviders";

export interface OrderDiscountData extends OrderDiscountCommonInput {
    amount: MoneyFragment;
}

export type GetOrderLineDiscountContextConsumerProps = (
    orderLineId: string
) => OrderLineDiscountContextConsumerProps;

export interface OrderLineDiscountData extends OrderDiscountCommonInput {
    moneyValue: MoneyFragment;
    undiscountedPrice: TaxedMoneyFragment;
}

export interface OrderDiscountConsumerCommonProps {
    openDialog: () => void;
    closeDialog: () => void;
    isDialogOpen: boolean;
    undiscountedPrice: MoneyFragment;
    discountedPrice: MoneyFragment;
}

export interface OrderLineDiscountConsumerProps {
    children: (values: OrderLineDiscountContextConsumerProps) => React.ReactNode;
    orderLineId: string;
}
