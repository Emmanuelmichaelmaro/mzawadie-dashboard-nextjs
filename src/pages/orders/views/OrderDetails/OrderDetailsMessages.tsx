// @ts-nocheck
import messages from "@mzawadie/containers/BackgroundTasks/messages";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { OrderFulfillmentApprove } from "@mzawadie/pages/orders/types/OrderFulfillmentApprove";
import getOrderErrorMessage from "@mzawadie/utils/errors/order";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { InvoiceEmailSend } from "../../types/InvoiceEmailSend";
import { InvoiceRequest } from "../../types/InvoiceRequest";
import { OrderAddNote } from "../../types/OrderAddNote";
import { OrderCancel } from "../../types/OrderCancel";
import { OrderCapture } from "../../types/OrderCapture";
import { OrderDraftCancel } from "../../types/OrderDraftCancel";
import { OrderDraftFinalize } from "../../types/OrderDraftFinalize";
import { OrderDraftUpdate } from "../../types/OrderDraftUpdate";
import { OrderFulfillmentCancel } from "../../types/OrderFulfillmentCancel";
import { OrderFulfillmentUpdateTracking } from "../../types/OrderFulfillmentUpdateTracking";
import { OrderLineDelete } from "../../types/OrderLineDelete";
import { OrderLineUpdate } from "../../types/OrderLineUpdate";
import { OrderLinesAdd } from "../../types/OrderLinesAdd";
import { OrderMarkAsPaid } from "../../types/OrderMarkAsPaid";
import { OrderShippingMethodUpdate } from "../../types/OrderShippingMethodUpdate";
import { OrderUpdate } from "../../types/OrderUpdate";
import { OrderVoid } from "../../types/OrderVoid";
import { orderUrl, OrderUrlQueryParams } from "../../urls";

interface OrderDetailsMessagesInterface {
    children: (props: {
        handleDraftCancel: (data: OrderDraftCancel) => void;
        handleDraftFinalize: (data: OrderDraftFinalize) => void;
        handleDraftUpdate: (data: OrderDraftUpdate) => void;
        handleNoteAdd: (data: OrderAddNote) => void;
        handleOrderCancel: (data: OrderCancel) => void;
        handleOrderFulfillmentApprove: (data: OrderFulfillmentApprove) => void;
        handleOrderFulfillmentCancel: (data: OrderFulfillmentCancel) => void;
        handleOrderFulfillmentUpdate: (data: OrderFulfillmentUpdateTracking) => void;
        handleOrderLinesAdd: (data: OrderLinesAdd) => void;
        handleOrderLineDelete: (data: OrderLineDelete) => void;
        handleOrderLineUpdate: (data: OrderLineUpdate) => void;
        handleOrderMarkAsPaid: (data: OrderMarkAsPaid) => void;
        handleOrderVoid: (data: OrderVoid) => void;
        handlePaymentCapture: (data: OrderCapture) => void;
        handleShippingMethodUpdate: (data: OrderShippingMethodUpdate) => void;
        handleUpdate: (data: OrderUpdate) => void;
        handleInvoiceGeneratePending: (data: InvoiceRequest) => void;
        handleInvoiceGenerateFinished: (data: InvoiceRequest) => void;
        handleInvoiceSend: (data: InvoiceEmailSend) => void;
    }) => React.ReactElement;
    id: string;
    params: OrderUrlQueryParams;
}

export const OrderDetailsMessages: React.FC<OrderDetailsMessagesInterface> = ({
    children,
    id,
    params,
}) => {
    const navigate = useNavigator();
    const pushMessage = useNotifier();
    const intl = useIntl();

    const [, closeModal] = createDialogActionHandlers(
        navigate,
        (params) => orderUrl(id, params),
        params
    );

    const handlePaymentCapture = (data: OrderCapture) => {
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

    const handleOrderMarkAsPaid = (data: OrderMarkAsPaid) => {
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

    const handleOrderCancel = (data: OrderCancel) => {
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

    const handleDraftCancel = (data: OrderDraftCancel) => {
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

    const handleOrderVoid = (data: OrderVoid) => {
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

    const handleNoteAdd = (data: OrderAddNote) => {
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

    const handleUpdate = (data: OrderUpdate) => {
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

    const handleDraftUpdate = (data: OrderDraftUpdate) => {
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

    const handleShippingMethodUpdate = (data: OrderShippingMethodUpdate) => {
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

    const handleOrderLineDelete = (data: OrderLineDelete) => {
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

    const handleOrderLinesAdd = (data: OrderLinesAdd) => {
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

    const handleOrderLineUpdate = (data: OrderLineUpdate) => {
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

    const handleOrderFulfillmentApprove = (data: OrderFulfillmentApprove) => {
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

    const handleOrderFulfillmentCancel = (data: OrderFulfillmentCancel) => {
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

    const handleOrderFulfillmentUpdate = (data: OrderFulfillmentUpdateTracking) => {
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

    const handleDraftFinalize = (data: OrderDraftFinalize) => {
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

    const handleInvoiceGeneratePending = (data: InvoiceRequest) => {
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

    const handleInvoiceGenerateFinished = (data: InvoiceRequest) => {
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

    const handleInvoiceSend = (data: InvoiceEmailSend) => {
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
