/* eslint-disable sort-keys */
// @ts-nocheck
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@mzawadie/hooks/useNotifier/utils";
import { OrderDiscountCommonInput } from "@mzawadie/pages/orders/components/OrderDiscountCommonModal/types";
import {
    useOrderDiscountAddMutation,
    useOrderDiscountDeleteMutation,
    useOrderDiscountUpdateMutation,
} from "@mzawadie/pages/orders/mutations";
import { OrderDetails_order } from "@mzawadie/pages/orders/types/OrderDetails";
import { OrderDiscountAdd } from "@mzawadie/pages/orders/types/OrderDiscountAdd";
import { OrderDiscountDelete } from "@mzawadie/pages/orders/types/OrderDiscountDelete";
import { OrderDiscountUpdate } from "@mzawadie/pages/orders/types/OrderDiscountUpdate";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React, { createContext } from "react";
import { useIntl } from "react-intl";

import { OrderDiscountConsumerCommonProps, OrderDiscountData } from "./types";
import { useDiscountDialog, getManualOrderDiscount, getParsedDiscountData } from "./utils";

export interface OrderDiscountContextConsumerProps extends OrderDiscountConsumerCommonProps {
    orderDiscountAddStatus: ConfirmButtonTransitionState;
    orderDiscountRemoveStatus: ConfirmButtonTransitionState;
    orderDiscount?: OrderDiscountData;
    addOrderDiscount: (data: OrderDiscountCommonInput) => void;
    removeOrderDiscount: () => void;
}

interface OrderDiscountProviderProps {
    children: React.ReactNode;
    order?: OrderDetails_order;
}

export const OrderDiscountProvider: React.FC<OrderDiscountProviderProps> = ({ children, order }) => {
    const intl = useIntl();
    const notify = useNotifier();

    const { id: orderId } = order;

    const { isDialogOpen, openDialog, closeDialog } = useDiscountDialog();

    const orderDiscount = getManualOrderDiscount(order);

    const [orderDiscountAdd, orderDiscountAddOpts] = useOrderDiscountAddMutation({
        onCompleted: ({ orderDiscountAdd: { errors } }: OrderDiscountAdd) =>
            handleDiscountDataSubmission(errors),
    });

    const [orderDiscountUpdate, orderDiscountUpdateOpts] = useOrderDiscountUpdateMutation({
        onCompleted: ({ orderDiscountUpdate: { errors } }: OrderDiscountUpdate) =>
            handleDiscountDataSubmission(errors),
    });

    const [orderDiscountRemove, orderDiscountRemoveOpts] = useOrderDiscountDeleteMutation({
        onCompleted: ({ orderDiscountDelete: { errors } }: OrderDiscountDelete) =>
            handleDiscountDataSubmission(errors),
    });

    const handleDiscountDataSubmission = (errors: any[]) => {
        closeDialog();
        notify(getDefaultNotifierSuccessErrorData(errors, intl));
    };

    const addOrderDiscount = (data: OrderDiscountCommonInput) =>
        orderDiscountAdd({
            variables: {
                orderId,
                input: getParsedDiscountData(data),
            },
        });

    const updateOrderDiscount = (data: OrderDiscountCommonInput) =>
        orderDiscount &&
        orderDiscountUpdate({
            variables: {
                discountId: orderDiscount?.id,
                input: getParsedDiscountData(data),
            },
        });

    const removeOrderDiscount = () =>
        orderDiscount && orderDiscountRemove({ variables: { discountId: orderDiscount.id } });

    const orderDiscountAction = orderDiscount ? updateOrderDiscount : addOrderDiscount;

    const orderDiscountAddStatus = orderDiscount
        ? orderDiscountUpdateOpts.status
        : orderDiscountAddOpts.status;

    const discountProviderValues: OrderDiscountContextConsumerProps = {
        orderDiscountAddStatus,
        orderDiscountRemoveStatus: orderDiscountRemoveOpts.status,
        orderDiscount,
        addOrderDiscount: orderDiscountAction,
        removeOrderDiscount,
        isDialogOpen,
        closeDialog,
        openDialog,
        discountedPrice: order.total.gross,
        undiscountedPrice: order.undiscountedTotal.gross,
    };

    return (
        <OrderDiscountContext.Provider value={discountProviderValues}>
            {children}
        </OrderDiscountContext.Provider>
    );
};

export const OrderDiscountContext = createContext<OrderDiscountContextConsumerProps>(null);
