// @ts-nocheck
import { commonMessages, extractMutationErrors } from "@mzawadie/core";
import {
    OrderErrorCode,
    useFulfillmentReturnProductsMutation,
    useOrderDetailsQuery,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { OrderReturnPage } from "@mzawadie/pages/orders/components/OrderReturnPage";
import { OrderReturnFormData } from "@mzawadie/pages/orders/components/OrderReturnPage/form";
import { orderUrl } from "@mzawadie/pages/orders/urls";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ReturnFormDataParser from "./utils";

export const messages = defineMessages({
    cannotRefundDescription: {
        defaultMessage:
            "We’ve encountered a problem while refunding the products. Product’s were not refunded. Please try again.",
        id: "XQBVEJ",
        description: "order return error description when cannot refund",
    },
    cannotRefundTitle: {
        defaultMessage: "Could’t refund products",
        id: "X6RMDJ",
        description: "order return error title when cannot refund",
    },
    successAlert: {
        defaultMessage: "Successfully returned products!",
        id: "/z9uo1",
        description: "order returned success message",
    },
});

interface OrderReturnProps {
    orderId: string;
}

const OrderReturn: React.FC<OrderReturnProps> = ({ orderId }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data, loading } = useOrderDetailsQuery({
        displayLoader: true,
        variables: {
            id: orderId,
        },
    });

    const [returnCreate, returnCreateOpts] = useFulfillmentReturnProductsMutation({
        onCompleted: ({ orderFulfillmentReturnProducts: { errors, replaceOrder } }) => {
            if (!errors.length) {
                notify({
                    status: "success",
                    text: intl.formatMessage(messages.successAlert),
                });

                navigateToOrder(replaceOrder?.id);

                return;
            }

            if (errors.some((err) => err.code === OrderErrorCode.CANNOT_REFUND)) {
                notify({
                    autohide: 5000,
                    status: "error",
                    text: intl.formatMessage(messages.cannotRefundDescription),
                    title: intl.formatMessage(messages.cannotRefundTitle),
                });

                return;
            }

            notify({
                autohide: 5000,
                status: "error",
                text: intl.formatMessage(commonMessages.somethingWentWrong),
            });
        },
    });

    const handleSubmit = async (formData: OrderReturnFormData) => {
        if (!data?.order) {
            return;
        }

        return extractMutationErrors(
            returnCreate({
                variables: {
                    id: data.order.id,
                    input: new ReturnFormDataParser(data.order, formData).getParsedData(),
                },
            })
        );
    };

    const navigateToOrder = (id?: string) => navigate(orderUrl(id || orderId));

    return (
        <OrderReturnPage
            errors={returnCreateOpts.data?.orderFulfillmentReturnProducts?.errors}
            order={data?.order}
            loading={loading || returnCreateOpts.loading}
            onSubmit={handleSubmit}
            onBack={() => navigateToOrder()}
        />
    );
};

OrderReturn.displayName = "OrderReturn";

export default OrderReturn;
