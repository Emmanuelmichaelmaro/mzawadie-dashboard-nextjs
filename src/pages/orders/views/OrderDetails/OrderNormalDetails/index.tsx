// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    PartialMutationProviderOutput,
    extractMutationErrors,
    getMutationState,
    getStringOrPlaceholder,
} from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useUser } from "@mzawadie/pages/auth";
import { useCustomerAddressesQuery } from "@mzawadie/pages/customers/queries";
import { customerUrl } from "@mzawadie/pages/customers/urls";
import { OrderCannotCancelOrderDialog } from "@mzawadie/pages/orders/components/OrderCannotCancelOrderDialog";
import { OrderCustomerAddressesEditDialogOutput } from "@mzawadie/pages/orders/components/OrderCustomerAddressesEditDialog/types";
import { OrderFulfillmentApproveDialog } from "@mzawadie/pages/orders/components/OrderFulfillmentApproveDialog";
import { OrderInvoiceEmailSendDialog } from "@mzawadie/pages/orders/components/OrderInvoiceEmailSendDialog";
import {
    OrderFulfillmentApprove,
    OrderFulfillmentApproveVariables,
} from "@mzawadie/pages/orders/types/OrderFulfillmentApprove";
import { OrderUpdate, OrderUpdateVariables } from "@mzawadie/pages/orders/types/OrderUpdate";
import {
    orderFulfillUrl,
    orderListUrl,
    orderRefundUrl,
    orderReturnPath,
    orderUrl,
    OrderUrlQueryParams,
} from "@mzawadie/pages/orders/urls";
import { productUrl } from "@mzawadie/pages/products/urls";
import { useWarehouseList } from "@mzawadie/pages/warehouses/queries";
import { FulfillmentStatus } from "@mzawadie/types/globalTypes";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { OrderAddressFields } from "../../../components/OrderAddressFields";
import { OrderCancelDialog } from "../../../components/OrderCancelDialog";
import { OrderDetailsPage } from "../../../components/OrderDetailsPage";
import { OrderFulfillmentCancelDialog } from "../../../components/OrderFulfillmentCancelDialog";
import { OrderFulfillmentTrackingDialog } from "../../../components/OrderFulfillmentTrackingDialog";
import { OrderMarkAsPaidDialog } from "../../../components/OrderMarkAsPaidDialog";
import { OrderPaymentDialog } from "../../../components/OrderPaymentDialog";
import { OrderPaymentVoidDialog } from "../../../components/OrderPaymentVoidDialog";
import { isAnyAddressEditModalOpen } from "../OrderDraftDetails";

interface OrderNormalDetailsProps {
    id: string;
    params: OrderUrlQueryParams;
    data: any;
    orderAddNote: any;
    orderInvoiceRequest: any;
    handleSubmit: any;
    orderUpdate: PartialMutationProviderOutput<OrderUpdate, OrderUpdateVariables>;
    orderCancel: any;
    orderPaymentMarkAsPaid: any;
    orderVoid: any;
    orderPaymentCapture: any;
    orderFulfillmentApprove: PartialMutationProviderOutput<
        OrderFulfillmentApprove,
        OrderFulfillmentApproveVariables
    >;
    orderFulfillmentCancel: any;
    orderFulfillmentUpdateTracking: any;
    orderInvoiceSend: any;
    updateMetadataOpts: any;
    updatePrivateMetadataOpts: any;
    openModal: any;
    closeModal: any;
}

export const OrderNormalDetails: React.FC<OrderNormalDetailsProps> = ({
    id,
    params,
    data,
    orderAddNote,
    orderInvoiceRequest,
    handleSubmit,
    orderUpdate,
    orderCancel,
    orderPaymentMarkAsPaid,
    orderVoid,
    orderPaymentCapture,
    orderFulfillmentApprove,
    orderFulfillmentCancel,
    orderFulfillmentUpdateTracking,
    orderInvoiceSend,
    updateMetadataOpts,
    updatePrivateMetadataOpts,
    openModal,
    closeModal,
}) => {
    const order = data?.order;
    const shop = data?.shop;
    const navigate = useNavigator();
    const { user } = useUser();

    const warehouses = useWarehouseList({
        displayLoader: true,
        variables: {
            first: 30,
        },
    });

    const { data: customerAddresses, loading: customerAddressesLoading } = useCustomerAddressesQuery({
        variables: {
            id: order?.user?.id,
        },
        skip: !order?.user?.id || !isAnyAddressEditModalOpen(params.action),
    });

    const handleCustomerChangeAddresses = async (
        data: Partial<OrderCustomerAddressesEditDialogOutput>
    ): Promise<any> =>
        orderUpdate.mutate({
            id,
            input: data,
        });

    const intl = useIntl();

    const [transactionReference, setTransactionReference] = React.useState("");

    const handleBack = () => navigate(orderListUrl());

    return (
        <>
            <WindowTitle
                title={intl.formatMessage(
                    {
                        defaultMessage: "Order #{orderNumber}",
                        id: "GbBCmr",
                        description: "window title",
                    },
                    {
                        orderNumber: getStringOrPlaceholder(data?.order?.number),
                    }
                )}
            />

            <OrderDetailsPage
                onOrderReturn={() => navigate(orderReturnPath(id))}
                disabled={updateMetadataOpts.loading || updatePrivateMetadataOpts.loading}
                onNoteAdd={(variables) =>
                    extractMutationErrors(
                        orderAddNote.mutate({
                            input: variables,
                            order: id,
                        })
                    )
                }
                onBack={handleBack}
                order={order}
                shop={shop}
                saveButtonBarState={getMutationState(
                    updateMetadataOpts.called || updatePrivateMetadataOpts.called,
                    updateMetadataOpts.loading || updatePrivateMetadataOpts.loading,
                    [
                        ...(updateMetadataOpts.data?.deleteMetadata.errors || []),
                        ...(updateMetadataOpts.data?.updateMetadata.errors || []),
                        ...(updatePrivateMetadataOpts.data?.deletePrivateMetadata.errors || []),
                        ...(updatePrivateMetadataOpts.data?.updatePrivateMetadata.errors || []),
                    ]
                )}
                shippingMethods={data?.order?.shippingMethods || []}
                userPermissions={user?.userPermissions || []}
                onOrderCancel={() => openModal("cancel")}
                onOrderFulfill={() => navigate(orderFulfillUrl(id))}
                onFulfillmentApprove={(fulfillmentId) =>
                    navigate(
                        orderUrl(id, {
                            action: "approve-fulfillment",
                            id: fulfillmentId,
                        })
                    )
                }
                onFulfillmentCancel={(fulfillmentId) =>
                    navigate(
                        orderUrl(id, {
                            action: "cancel-fulfillment",
                            id: fulfillmentId,
                        })
                    )
                }
                onFulfillmentTrackingNumberUpdate={(fulfillmentId) =>
                    navigate(
                        orderUrl(id, {
                            action: "edit-fulfillment",
                            id: fulfillmentId,
                        })
                    )
                }
                onPaymentCapture={() => openModal("capture")}
                onPaymentVoid={() => openModal("void")}
                onPaymentRefund={() => navigate(orderRefundUrl(id))}
                onProductClick={(id) => () => navigate(productUrl(id))}
                onBillingAddressEdit={() => openModal("edit-billing-address")}
                onShippingAddressEdit={() => openModal("edit-shipping-address")}
                onPaymentPaid={() => openModal("mark-paid")}
                onProfileView={() => navigate(customerUrl(order.user.id))}
                onInvoiceClick={(id) =>
                    window.open(order.invoices.find((invoice) => invoice.id === id)?.url, "_blank")
                }
                onInvoiceGenerate={() =>
                    orderInvoiceRequest.mutate({
                        orderId: id,
                    })
                }
                onInvoiceSend={(id) => openModal("invoice-send", { id })}
                onSubmit={handleSubmit}
            />

            <OrderCannotCancelOrderDialog
                onClose={closeModal}
                open={
                    params.action === "cancel" &&
                    order?.fulfillments.some(
                        (fulfillment) => fulfillment.status === FulfillmentStatus.FULFILLED
                    )
                }
            />

            <OrderCancelDialog
                confirmButtonState={orderCancel.opts.status}
                errors={orderCancel.opts.data?.orderCancel.errors || []}
                number={order?.number}
                open={params.action === "cancel"}
                onClose={closeModal}
                onSubmit={() =>
                    orderCancel.mutate({
                        id,
                    })
                }
            />

            <OrderMarkAsPaidDialog
                confirmButtonState={orderPaymentMarkAsPaid.opts.status}
                errors={orderPaymentMarkAsPaid.opts.data?.orderMarkAsPaid.errors || []}
                onClose={closeModal}
                onConfirm={() =>
                    orderPaymentMarkAsPaid.mutate({
                        id,
                        transactionReference,
                    })
                }
                open={params.action === "mark-paid"}
                transactionReference={transactionReference}
                handleTransactionReference={({ target }) => setTransactionReference(target.value)}
            />

            <OrderPaymentVoidDialog
                confirmButtonState={orderVoid.opts.status}
                errors={orderVoid.opts.data?.orderVoid.errors || []}
                open={params.action === "void"}
                onClose={closeModal}
                onConfirm={() => orderVoid.mutate({ id })}
            />

            <OrderPaymentDialog
                confirmButtonState={orderPaymentCapture.opts.status}
                errors={orderPaymentCapture.opts.data?.orderCapture.errors || []}
                initial={order?.total.gross.amount}
                open={params.action === "capture"}
                onClose={closeModal}
                onSubmit={(variables) =>
                    orderPaymentCapture.mutate({
                        ...variables,
                        id,
                    })
                }
            />

            <OrderFulfillmentApproveDialog
                confirmButtonState={orderFulfillmentApprove.opts.status}
                errors={orderFulfillmentApprove.opts.data?.orderFulfillmentApprove?.errors || []}
                open={params.action === "approve-fulfillment"}
                onConfirm={({ notifyCustomer }) =>
                    orderFulfillmentApprove.mutate({
                        id: params.id,
                        notifyCustomer,
                    })
                }
                onClose={closeModal}
            />

            <OrderFulfillmentCancelDialog
                confirmButtonState={orderFulfillmentCancel.opts.status}
                errors={orderFulfillmentCancel.opts.data?.orderFulfillmentCancel.errors || []}
                open={params.action === "cancel-fulfillment"}
                warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
                onConfirm={(variables) =>
                    orderFulfillmentCancel.mutate({
                        id: params.id,
                        input: variables,
                    })
                }
                onClose={closeModal}
            />

            <OrderFulfillmentTrackingDialog
                confirmButtonState={orderFulfillmentUpdateTracking.opts.status}
                errors={
                    orderFulfillmentUpdateTracking.opts.data?.orderFulfillmentUpdateTracking.errors ||
                    []
                }
                open={params.action === "edit-fulfillment"}
                trackingNumber={getStringOrPlaceholder(
                    data?.order?.fulfillments.find((fulfillment) => fulfillment.id === params.id)
                        ?.trackingNumber
                )}
                onConfirm={(variables) =>
                    orderFulfillmentUpdateTracking.mutate({
                        id: params.id,
                        input: {
                            ...variables,
                            notifyCustomer: true,
                        },
                    })
                }
                onClose={closeModal}
            />

            <OrderInvoiceEmailSendDialog
                confirmButtonState={orderInvoiceSend.opts.status}
                errors={orderInvoiceSend.opts.data?.invoiceSendEmail.errors || []}
                open={params.action === "invoice-send"}
                invoice={order?.invoices?.find((invoice) => invoice.id === params.id)}
                onClose={closeModal}
                onSend={() => orderInvoiceSend.mutate({ id: params.id })}
            />

            <OrderAddressFields
                action={params?.action}
                orderShippingAddress={order?.shippingAddress}
                orderBillingAddress={order?.billingAddress}
                customerAddressesLoading={customerAddressesLoading}
                isDraft={false}
                countries={data?.shop?.countries}
                customer={customerAddresses?.user}
                onClose={closeModal}
                onConfirm={handleCustomerChangeAddresses}
                confirmButtonState={orderUpdate.opts.status}
                errors={orderUpdate.opts.data?.orderUpdate.errors}
            />
        </>
    );
};

export default OrderNormalDetails;
