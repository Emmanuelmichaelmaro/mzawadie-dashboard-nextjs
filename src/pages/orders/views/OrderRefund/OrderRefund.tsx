import { extractMutationErrors } from "@mzawadie/core";
import {
    useOrderFulfillmentRefundProductsMutation,
    useOrderRefundDataQuery,
    useOrderRefundMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { OrderRefundPage } from "@mzawadie/pages/orders/components/OrderRefundPage";
import {
    OrderRefundAmountCalculationMode,
    OrderRefundSubmitData,
    OrderRefundType,
} from "@mzawadie/pages/orders/components/OrderRefundPage/form";
import { orderUrl } from "@mzawadie/pages/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

const getAutomaticallyCalculatedProductsRefundInput = (formData: OrderRefundSubmitData) => ({
    fulfillmentLines: formData.refundedFulfilledProductQuantities
        .filter((line) => line.value !== "0")
        .map((line) => ({
            fulfillmentLineId: line.id,
            quantity: Number(line.value),
        })),
    includeShippingCosts: formData.refundShipmentCosts,
    orderLines: formData.refundedProductQuantities
        .filter((line) => line.value !== "0")
        .map((line) => ({
            orderLineId: line.id,
            quantity: Number(line.value),
        })),
});

const getManuallySetProductsRefundInput = (formData: OrderRefundSubmitData) => ({
    amountToRefund: formData.amount,
    fulfillmentLines: formData.refundedFulfilledProductQuantities
        .filter((line) => line.value !== "0")
        .map((line) => ({
            fulfillmentLineId: line.id,
            quantity: Number(line.value),
        })),
    includeShippingCosts: formData.refundShipmentCosts,
    orderLines: formData.refundedProductQuantities
        .filter((line) => line.value !== "0")
        .map((line) => ({
            orderLineId: line.id,
            quantity: Number(line.value),
        })),
});

interface OrderRefundProps {
    orderId: string;
}

const OrderRefund: React.FC<OrderRefundProps> = ({ orderId }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    const { data, loading } = useOrderRefundDataQuery({
        displayLoader: true,
        variables: {
            orderId,
        },
    });

    const [refundOrder, refundOrderOpts] = useOrderRefundMutation({
        onCompleted: (data) => {
            if (data.orderRefund?.errors.length === 0) {
                navigate(orderUrl(orderId), { replace: true });
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Refunded Items",
                        id: "XRf1Bi",
                        description: "order refunded success message",
                    }),
                });
            }
        },
    });

    const [refundOrderFulfillmentProducts, refundOrderFulfillmentProductsOpts] =
        useOrderFulfillmentRefundProductsMutation({
            onCompleted: (data) => {
                if (data.orderFulfillmentRefundProducts?.errors.length === 0) {
                    navigate(orderUrl(orderId), { replace: true });
                    notify({
                        status: "success",
                        text: intl.formatMessage({
                            defaultMessage: "Refunded Items",
                            id: "XRf1Bi",
                            description: "order refunded success message",
                        }),
                    });
                }
            },
        });

    const handleSubmitMiscellaneousRefund = async (formData: OrderRefundSubmitData) => {
        await extractMutationErrors(
            refundOrder({
                variables: {
                    amount: formData.amount,
                    id: orderId,
                },
            })
        );
    };

    const handleSubmitProductsRefund = async (formData: OrderRefundSubmitData) => {
        const input =
            formData.amountCalculationMode === OrderRefundAmountCalculationMode.AUTOMATIC
                ? getAutomaticallyCalculatedProductsRefundInput(formData)
                : getManuallySetProductsRefundInput(formData);

        return extractMutationErrors(
            refundOrderFulfillmentProducts({
                variables: {
                    input,
                    order: orderId,
                },
            })
        );
    };

    const handleSubmit = async (formData: OrderRefundSubmitData) =>
        formData.type === OrderRefundType.MISCELLANEOUS
            ? handleSubmitMiscellaneousRefund(formData)
            : handleSubmitProductsRefund(formData);

    return (
        <OrderRefundPage
            order={data?.order}
            disabled={loading || refundOrderOpts.loading || refundOrderFulfillmentProductsOpts.loading}
            errors={[
                ...(refundOrderOpts.data?.orderRefund?.errors || []),
                ...(refundOrderFulfillmentProductsOpts.data?.orderFulfillmentRefundProducts?.errors ||
                    []),
            ]}
            onSubmit={handleSubmit}
            onBack={() => navigate(orderUrl(orderId))}
        />
    );
};

OrderRefund.displayName = "OrderRefund";

export default OrderRefund;
