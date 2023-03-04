/* eslint-disable sort-keys */
// @ts-nocheck
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@mzawadie/hooks/useNotifier/utils";
import { OrderDiscountCommonInput } from "@mzawadie/pages/orders/components/OrderDiscountCommonModal/types";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import {
    useOrderLineDiscountRemoveMutation,
    useOrderLineDiscountUpdateMutation,
} from "@mzawadie/pages/orders/mutations";
import { OrderDetails_order } from "@mzawadie/pages/orders/types/OrderDetails";
import { OrderLineDiscountRemove } from "@mzawadie/pages/orders/types/OrderLineDiscountRemove";
import { OrderLineDiscountUpdate } from "@mzawadie/pages/orders/types/OrderLineDiscountUpdate";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React, { createContext, useState } from "react";
import { useIntl } from "react-intl";

import {
    GetOrderLineDiscountContextConsumerProps,
    OrderDiscountConsumerCommonProps,
    OrderLineDiscountConsumerProps,
    OrderLineDiscountData,
} from "./types";
import { useDiscountDialog, getOrderLineDiscount, getParsedDiscountData } from "./utils";

export interface OrderLineDiscountContextConsumerProps extends OrderDiscountConsumerCommonProps {
    addOrderLineDiscount: (data: OrderDiscountCommonInput) => void;
    removeOrderLineDiscount: () => void;
    orderLineDiscount?: OrderLineDiscountData;
    orderLineDiscountUpdateStatus: ConfirmButtonTransitionState;
    orderLineDiscountRemoveStatus: ConfirmButtonTransitionState;
}

interface DiscountProviderProps {
    children: React.ReactNode;
    order: OrderDetails_order;
}

export const OrderLineDiscountContext = createContext<GetOrderLineDiscountContextConsumerProps>(null);

export const OrderLineDiscountProvider: React.FC<DiscountProviderProps> = ({ children, order }) => {
    const intl = useIntl();
    const notify = useNotifier();
    const { isDialogOpen, openDialog, closeDialog } = useDiscountDialog();
    const [currentLineId, setCurrentLineId] = useState<string | null>(null);

    const handleOpenDialog = (orderLineId: string) => () => {
        setCurrentLineId(orderLineId);
        openDialog();
    };

    const handleCloseDialog = () => {
        setCurrentLineId(null);
        closeDialog();
    };

    const [orderLineDiscountAddOrUpdate, orderLineDiscountAddOrUpdateOpts] =
        useOrderLineDiscountUpdateMutation({
            onCompleted: ({ orderLineDiscountUpdate: { errors } }: OrderLineDiscountUpdate) =>
                handleDiscountDataSubmission(errors),
        });

    const [orderLineDiscountRemove, orderLineDiscountRemoveOpts] = useOrderLineDiscountRemoveMutation({
        onCompleted: ({ orderLineDiscountRemove: { errors } }: OrderLineDiscountRemove) =>
            handleDiscountDataSubmission(errors),
    });

    const handleDiscountDataSubmission = (errors: any[]) => {
        closeDialog();
        notify(getDefaultNotifierSuccessErrorData(errors, intl));
    };

    const addOrUpdateOrderLineDiscount = (orderLineId: string) => (input: OrderDiscountCommonInput) =>
        orderLineDiscountAddOrUpdate({
            variables: { orderLineId, input: getParsedDiscountData(input) },
        });

    const removeOrderLineDiscount = (orderLineId: string) => () =>
        orderLineDiscountRemove({ variables: { orderLineId } });

    const isOrderLineDialogOpen = (orderLineId: string) =>
        isDialogOpen && currentLineId === orderLineId;

    const getOrderLine = (orderLineId: string) => order?.lines.find(getById(orderLineId));

    const getDiscountProviderValues = (orderLineId: string): OrderLineDiscountContextConsumerProps => ({
        addOrderLineDiscount: addOrUpdateOrderLineDiscount(orderLineId),
        removeOrderLineDiscount: removeOrderLineDiscount(orderLineId),
        orderLineDiscount: getOrderLineDiscount(order, orderLineId),
        isDialogOpen: isOrderLineDialogOpen(orderLineId),
        orderLineDiscountUpdateStatus: orderLineDiscountAddOrUpdateOpts.status,
        orderLineDiscountRemoveStatus: orderLineDiscountRemoveOpts.status,
        closeDialog: handleCloseDialog,
        openDialog: handleOpenDialog(orderLineId),
        discountedPrice: getOrderLine(orderLineId).unitPrice.gross,
        undiscountedPrice: getOrderLine(orderLineId).undiscountedUnitPrice.gross,
    });

    return (
        <OrderLineDiscountContext.Provider value={getDiscountProviderValues}>
            {children}
        </OrderLineDiscountContext.Provider>
    );
};

export const OrderLineDiscountConsumer: React.FC<OrderLineDiscountConsumerProps> = ({
    children,
    orderLineId,
}) => (
    <OrderLineDiscountContext.Consumer>
        {(getValues: GetOrderLineDiscountContextConsumerProps) => children(getValues(orderLineId))}
    </OrderLineDiscountContext.Consumer>
);
