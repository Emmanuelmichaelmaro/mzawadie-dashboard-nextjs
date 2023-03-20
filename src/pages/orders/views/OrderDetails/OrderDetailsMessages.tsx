// @ts-nocheck
import messages from "@mzawadie/containers/BackgroundTasks/messages";
import {
    InvoiceEmailSendMutation,
    InvoiceRequestMutation,
    OrderAddNoteMutation,
    OrderCancelMutation,
    OrderCaptureMutation,
    OrderDraftCancelMutation,
    OrderDraftFinalizeMutation,
    OrderDraftUpdateMutation,
    OrderFulfillmentApproveMutation,
    OrderFulfillmentCancelMutation,
    OrderFulfillmentUpdateTrackingMutation,
    OrderLineDeleteMutation,
    OrderLinesAddMutation,
    OrderLineUpdateMutation,
    OrderMarkAsPaidMutation,
    OrderShippingMethodUpdateMutation,
    OrderUpdateMutation,
    OrderVoidMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { orderUrl, OrderUrlQueryParams } from "@mzawadie/pages/orders/urls";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

interface OrderDetailsMessagesProps {
    children: (props: {
        handleDraftCancel: (data: OrderDraftCancelMutation) => void;
        handleDraftFinalize: (data: OrderDraftFinalizeMutation) => void;
        handleDraftUpdate: (data: OrderDraftUpdateMutation) => void;
        handleNoteAdd: (data: OrderAddNoteMutation) => void;
        handleOrderCancel: (data: OrderCancelMutation) => void;
        handleOrderFulfillmentApprove: (data: OrderFulfillmentApproveMutation) => void;
        handleOrderFulfillmentCancel: (data: OrderFulfillmentCancelMutation) => void;
        handleOrderFulfillmentUpdate: (data: OrderFulfillmentUpdateTrackingMutation) => void;
        handleOrderLinesAdd: (data: OrderLinesAddMutation) => void;
        handleOrderLineDelete: (data: OrderLineDeleteMutation) => void;
        handleOrderLineUpdate: (data: OrderLineUpdateMutation) => void;
        handleOrderMarkAsPaid: (data: OrderMarkAsPaidMutation) => void;
        handleOrderVoid: (data: OrderVoidMutation) => void;
        handlePaymentCapture: (data: OrderCaptureMutation) => void;
        handleShippingMethodUpdate: (data: OrderShippingMethodUpdateMutation) => void;
        handleUpdate: (data: OrderUpdateMutation) => void;
        handleInvoiceGeneratePending: (data: InvoiceRequestMutation) => void;
        handleInvoiceGenerateFinished: (data: InvoiceRequestMutation) => void;
        handleInvoiceSend: (data: InvoiceEmailSendMutation) => void;
    }) => React.ReactElement;
    id: string;
    params: OrderUrlQueryParams;
}

export const OrderDetailsMessages: React.FC<OrderDetailsMessagesProps> = ({ children, id, params }) => {
    const navigate = useNavigator();
    const pushMessage = useNotifier();
    const intl = useIntl();

    const [, closeModal] = createDialogActionHandlers(
        navigate,
        (params) => orderUrl(id, params),
        params
    );

    const handlePaymentCapture = (data: OrderCaptureMutation) => {
        const errs = data.orderCapture?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Payment successfully captured",
                    id: "9RCuN3",
                }),
            });
            closeModal();
        }
    };

    const handleOrderMarkAsPaid = (data: OrderMarkAsPaidMutation) => {
        const errs = data.orderMarkAsPaid?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order marked as paid",
                    id: "lL1HTg",
                }),
            });
            closeModal();
        }
    };

    const handleOrderCancel = (data: OrderCancelMutation) => {
        const errs = data.orderCancel?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order successfully cancelled",
                    id: "W/Es0H",
                }),
            });
            closeModal();
        }
    };

    const handleDraftCancel = (data: OrderDraftCancelMutation) => {
        const errs = data.draftOrderDelete?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order successfully cancelled",
                    id: "W/Es0H",
                }),
            });
            closeModal();
        }
    };

    const handleOrderVoid = (data: OrderVoidMutation) => {
        const errs = data.orderVoid?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order payment successfully voided",
                    id: "L87bp7",
                }),
            });
            closeModal();
        }
    };

    const handleNoteAdd = (data: OrderAddNoteMutation) => {
        const errs = data.orderAddNote?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Note successfully added",
                    id: "KmPicj",
                }),
            });
        }
    };

    const handleUpdate = (data: OrderUpdateMutation) => {
        const errs = data.orderUpdate?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order successfully updated",
                    id: "j2fPVo",
                }),
            });
            closeModal();
        }
    };

    const handleDraftUpdate = (data: OrderDraftUpdateMutation) => {
        const errs = data.draftOrderUpdate?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order successfully updated",
                    id: "j2fPVo",
                }),
            });
            closeModal();
        }
    };

    const handleShippingMethodUpdate = (data: OrderShippingMethodUpdateMutation) => {
        const errs = data.orderUpdateShipping?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Shipping method successfully updated",
                    id: "7U8GRy",
                }),
            });
            closeModal();
        }
    };

    const handleOrderLineDelete = (data: OrderLineDeleteMutation) => {
        const errs = data.orderLineDelete?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order line deleted",
                    id: "9OtpHt",
                }),
            });
        }
    };

    const handleOrderLinesAdd = (data: OrderLinesAddMutation) => {
        const errs = data.orderLinesCreate?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order line added",
                    id: "HlCkMT",
                }),
            });
            closeModal();
        }
    };

    const handleOrderLineUpdate = (data: OrderLineUpdateMutation) => {
        const errs = data.orderLineUpdate?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Order line updated",
                    id: "Fn3bE0",
                }),
            });
        } else {
            errs.forEach((error) =>
                pushMessage({
                    status: "error",
                    text: getOrderErrorMessage(error, intl),
                })
            );
        }
    };

    const handleOrderFulfillmentApprove = (data: OrderFulfillmentApproveMutation) => {
        const errs = data.orderFulfillmentApprove?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Fulfillment successfully approved",
                    id: "+sX7yS",
                }),
            });
            closeModal();
        }
    };

    const handleOrderFulfillmentCancel = (data: OrderFulfillmentCancelMutation) => {
        const errs = data.orderFulfillmentCancel?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Fulfillment successfully cancelled",
                    id: "uMpv1v",
                }),
            });
            closeModal();
        }
    };

    const handleOrderFulfillmentUpdate = (data: OrderFulfillmentUpdateTrackingMutation) => {
        const errs = data.orderFulfillmentUpdateTracking?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Fulfillment successfully updated",
                    id: "CZmloB",
                }),
            });
            closeModal();
        }
    };

    const handleDraftFinalize = (data: OrderDraftFinalizeMutation) => {
        const errs = data.draftOrderComplete?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Draft order successfully finalized",
                    id: "c4gbXr",
                }),
            });
        }
    };

    const handleInvoiceGeneratePending = (data: InvoiceRequestMutation) => {
        const errs = data.invoiceRequest?.errors;
        if (errs.length === 0) {
            pushMessage({
                text: intl.formatMessage({
                    defaultMessage:
                        "We’re generating the invoice you requested. Please wait a couple of moments",
                    id: "ND5x+V",
                }),
                title: intl.formatMessage({
                    defaultMessage: "Invoice is Generating",
                    id: "PKJqcq",
                }),
            });
            closeModal();
        }
    };

    const handleInvoiceGenerateFinished = (data: InvoiceRequestMutation) => {
        const errs = data.invoiceRequest?.errors;
        if (errs.length === 0) {
            pushMessage({
                status: "success",
                text: intl.formatMessage(messages.invoiceGenerateFinishedText),
                title: intl.formatMessage(messages.invoiceGenerateFinishedTitle),
            });
            closeModal();
        }
    };

    const handleInvoiceSend = (data: InvoiceEmailSendMutation) => {
        const errs = data.invoiceSendNotification?.errors;
        if (errs.length === 0) {
            pushMessage({
                text: intl.formatMessage({
                    defaultMessage: "Invoice email sent",
                    id: "3u+4NZ",
                }),
            });
            closeModal();
        }
    };

    return children({
        handleDraftCancel,
        handleDraftFinalize,
        handleDraftUpdate,
        handleInvoiceGenerateFinished,
        handleInvoiceGeneratePending,
        handleInvoiceSend,
        handleNoteAdd,
        handleOrderCancel,
        handleOrderFulfillmentApprove,
        handleOrderFulfillmentCancel,
        handleOrderFulfillmentUpdate,
        handleOrderLineDelete,
        handleOrderLineUpdate,
        handleOrderLinesAdd,
        handleOrderMarkAsPaid,
        handleOrderVoid,
        handlePaymentCapture,
        handleShippingMethodUpdate,
        handleUpdate,
    });
};
