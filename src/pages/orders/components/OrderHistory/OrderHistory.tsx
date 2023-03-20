// @ts-nocheck
import { Typography } from "@material-ui/core";
import { Form } from "@mzawadie/components/Form";
import Hr from "@mzawadie/components/Hr";
import Skeleton from "@mzawadie/components/Skeleton";
import {
    Timeline,
    TimelineAddNote,
    TimelineEvent,
    TimelineEventProps,
    TimelineNote,
} from "@mzawadie/components/Timeline";
import { OrderEventFragment, OrderEventsEmailsEnum, OrderEventsEnum } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import ExtendedTimelineEvent from "./ExtendedTimelineEvent";
import LinkedTimelineEvent from "./LinkedTimelineEvent";
import { getEventSecondaryTitle, isTimelineEventOfType } from "./utils";

export const getEventMessage = (event: OrderEventFragment, intl: IntlShape) => {
    const getUserOrApp = () => {
        if (event.user) {
            return event.user.email;
        }
        if (event.app) {
            return event.app.name;
        }
    };

    switch (event.type) {
        case OrderEventsEnum.CANCELED:
            return intl.formatMessage({
                defaultMessage: "Order was cancelled",
                id: "zRrcOG",
                description: "order history message",
            });
        case OrderEventsEnum.ADDED_PRODUCTS:
            return intl.formatMessage({
                defaultMessage: "Products were added to an order",
                id: "U1eJIw",
                description: "order history message",
            });
        case OrderEventsEnum.DRAFT_CREATED:
            return intl.formatMessage({
                defaultMessage: "Draft order was created",
                id: "hWO1SD",
                description: "order history message",
            });
        case OrderEventsEnum.REMOVED_PRODUCTS:
            return intl.formatMessage({
                defaultMessage: "Products were deleted from an order",
                id: "fehqPs",
                description: "order history message",
            });
        case OrderEventsEnum.EMAIL_SENT:
            switch (event.emailType) {
                case OrderEventsEmailsEnum.DIGITAL_LINKS:
                    return intl.formatMessage({
                        defaultMessage: "Links to the order's digital goods were sent",
                        id: "OzHN0Z",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.FULFILLMENT_CONFIRMATION:
                    return intl.formatMessage({
                        defaultMessage: "Fulfillment confirmation was sent to customer",
                        id: "aq5ZiN",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.CONFIRMED:
                    return intl.formatMessage({
                        defaultMessage: "Order confirmation was sent to customer",
                        id: "cqZ5UH",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.PAYMENT_CONFIRMATION:
                    return intl.formatMessage({
                        defaultMessage: "Payment confirmation was sent to customer",
                        id: "4Z6BtA",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.SHIPPING_CONFIRMATION:
                    return intl.formatMessage({
                        defaultMessage: "Shipping details was sent to customer",
                        id: "BCPrmK",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.TRACKING_UPDATED:
                    return intl.formatMessage({
                        defaultMessage: "Shipping tracking number was sent to customer",
                        id: "j3yE7I",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.ORDER_CANCEL:
                    return intl.formatMessage({
                        defaultMessage: "Order cancel information was sent to customer",
                        id: "06bR4Z",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.ORDER_CONFIRMATION:
                    return intl.formatMessage({
                        defaultMessage: "Order placed information was sent to customer",
                        id: "oQ27V4",
                        description: "order history message",
                    });
                case OrderEventsEmailsEnum.ORDER_REFUND:
                    return intl.formatMessage({
                        defaultMessage: "Order refund information was sent to customer",
                        id: "9piUVz",
                        description: "order history message",
                    });
            }
        case OrderEventsEnum.FULFILLMENT_CANCELED:
            return intl.formatMessage({
                defaultMessage: "Fulfillment was cancelled",
                id: "GLy2UR",
                description: "order history message",
            });
        case OrderEventsEnum.INVOICE_REQUESTED:
            return intl.formatMessage(
                {
                    defaultMessage: "Invoice was requested by {requestedBy}",
                    id: "chvryR",
                    description: "order history message",
                },
                {
                    requestedBy: getUserOrApp(),
                }
            );
        case OrderEventsEnum.INVOICE_GENERATED:
            return intl.formatMessage(
                {
                    defaultMessage: "Invoice no. {invoiceNumber} was generated by {generatedBy}",
                    id: "pTpx0p",
                    description: "order history message",
                },
                {
                    generatedBy: getUserOrApp(),
                    invoiceNumber: event.invoiceNumber,
                }
            );
        case OrderEventsEnum.INVOICE_UPDATED:
            return intl.formatMessage(
                {
                    defaultMessage: "Invoice no. {invoiceNumber} was updated",
                    id: "6RQKxH",
                    description: "order history message",
                },
                {
                    invoiceNumber: event.invoiceNumber,
                }
            );
        case OrderEventsEnum.INVOICE_SENT:
            return intl.formatMessage(
                {
                    defaultMessage: "Invoice was sent to customer by {sentBy}",
                    id: "qddy2Z",
                    description: "order history message",
                },
                {
                    sentBy: getUserOrApp(),
                }
            );
        case OrderEventsEnum.FULFILLMENT_AWAITS_APPROVAL:
            return intl.formatMessage({
                defaultMessage: "Fulfillment awaits approval",
                id: "PcPMjC",
                description: "order history message",
            });
        case OrderEventsEnum.FULFILLMENT_FULFILLED_ITEMS:
            return intl.formatMessage(
                {
                    defaultMessage: "Fulfilled {quantity} items",
                    id: "nHmugP",
                    description: "order history message",
                },
                {
                    quantity: event.quantity,
                }
            );
        case OrderEventsEnum.FULFILLMENT_REFUNDED:
            return intl.formatMessage(
                {
                    defaultMessage: "Order was refunded by {refundedBy}",
                    id: "D3WUc/",
                    description: "order history message",
                },
                {
                    refundedBy: getUserOrApp(),
                }
            );
        case OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS:
            return intl.formatMessage(
                {
                    defaultMessage: "Restocked {quantity} items",
                    id: "wOeIR4",
                    description: "order history message",
                },
                {
                    quantity: event.quantity,
                }
            );
        case OrderEventsEnum.NOTE_ADDED:
            return intl.formatMessage({
                defaultMessage: "Note was added to the order",
                id: "6WRFp2",
                description: "order history message",
            });
        case OrderEventsEnum.ORDER_FULLY_PAID:
            return intl.formatMessage({
                defaultMessage: "Order was fully paid",
                id: "P/EDn1",
                description: "order history message",
            });
        case OrderEventsEnum.ORDER_MARKED_AS_PAID:
            return intl.formatMessage({
                defaultMessage: "Order was marked as paid",
                id: "fkplbE",
                description: "order history message",
            });
        case OrderEventsEnum.OTHER:
            return event.message;
        case OrderEventsEnum.OVERSOLD_ITEMS:
            return intl.formatMessage(
                {
                    defaultMessage: "Oversold {quantity} items",
                    id: "Fl3ORD",
                    description: "order history message",
                },
                {
                    quantity: event.quantity,
                }
            );
        case OrderEventsEnum.PAYMENT_CAPTURED:
            return intl.formatMessage({
                defaultMessage: "Payment was captured",
                id: "2yV+s8",
                description: "order history message",
            });
        case OrderEventsEnum.PAYMENT_FAILED:
            return intl.formatMessage({
                defaultMessage: "Payment failed",
                id: "TCR639",
                description: "order history message",
            });
        case OrderEventsEnum.PAYMENT_REFUNDED:
            return intl.formatMessage({
                defaultMessage: "Payment was refunded",
                id: "3fgyFh",
                description: "order history message",
            });
        case OrderEventsEnum.PAYMENT_VOIDED:
            return intl.formatMessage({
                defaultMessage: "Payment was voided",
                id: "8RnPGF",
                description: "order history message",
            });
        case OrderEventsEnum.PLACED:
            return intl.formatMessage({
                defaultMessage: "Order was placed",
                id: "GJAX0z",
                description: "order history message",
            });
        case OrderEventsEnum.PLACED_FROM_DRAFT:
            return intl.formatMessage({
                defaultMessage: "Order was created from draft",
                id: "OKGd/k",
                description: "order history message",
            });
        case OrderEventsEnum.TRACKING_UPDATED:
            return intl.formatMessage({
                defaultMessage: "Updated fulfillment group's tracking number",
                id: "e92Uxp",
                description: "order history message",
            });
        case OrderEventsEnum.UPDATED_ADDRESS:
            return intl.formatMessage({
                defaultMessage: "Order address was updated",
                id: "RLTaAR",
                description: "order history message",
            });
        case OrderEventsEnum.PAYMENT_AUTHORIZED:
            return intl.formatMessage({
                defaultMessage: "Payment was authorized",
                id: "GVM/fi",
                description: "order history message",
            });
        case OrderEventsEnum.CONFIRMED:
            return intl.formatMessage({
                defaultMessage: "Order was confirmed",
                id: "ubasgL",
                description: "order history message",
            });
        case OrderEventsEnum.EXTERNAL_SERVICE_NOTIFICATION:
            return event.message;
    }
};

export interface FormData {
    message: string;
}

const useStyles = makeStyles(
    (theme) => ({
        eventSubtitle: {
            marginTop: theme.spacing(1),
        },
        header: {
            fontWeight: 500,
            marginBottom: theme.spacing(1),
        },
        linesTableCell: {
            paddingRight: theme.spacing(3),
        },
        root: { marginTop: theme.spacing(4) },
        user: {
            marginBottom: theme.spacing(1),
        },
    }),
    { name: "OrderHistory" }
);

interface OrderHistoryProps {
    history: OrderEventFragment[];
    orderCurrency: string;
    onNoteAdd: (data: FormData) => SubmitPromise;
}

const OrderHistory: React.FC<OrderHistoryProps> = (props) => {
    const { history, orderCurrency, onNoteAdd } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    const getTimelineEventTitleProps = (event: OrderEventFragment): Partial<TimelineEventProps> => {
        const { type, message } = event;

        const title = isTimelineEventOfType("rawMessage", type)
            ? message
            : getEventMessage(event, intl);

        if (isTimelineEventOfType("secondaryTitle", type)) {
            return {
                secondaryTitle: intl.formatMessage(...getEventSecondaryTitle(event)),
                title,
            };
        }

        return { title };
    };

    return (
        <div className={classes.root}>
            <Typography className={classes.header} color="textSecondary">
                <FormattedMessage defaultMessage="Order History" id="XBfvKN" />
            </Typography>
            <Hr />
            {history ? (
                <Timeline>
                    <Form confirmLeave initial={{ message: "" }} onSubmit={onNoteAdd} resetOnSubmit>
                        {({ change, data, reset, submit }) => (
                            <TimelineAddNote
                                message={data.message}
                                reset={reset}
                                onChange={change}
                                onSubmit={submit}
                            />
                        )}
                    </Form>
                    {history
                        .slice()
                        .reverse()
                        .map((event) => {
                            const { id, user, date, message, type } = event;

                            if (isTimelineEventOfType("note", type)) {
                                return (
                                    <TimelineNote date={date} user={user} message={message} key={id} />
                                );
                            }
                            if (isTimelineEventOfType("extendable", type)) {
                                return (
                                    <ExtendedTimelineEvent
                                        event={event}
                                        orderCurrency={orderCurrency}
                                    />
                                );
                            }

                            if (isTimelineEventOfType("linked", type)) {
                                return <LinkedTimelineEvent event={event} key={id} />;
                            }

                            return (
                                <TimelineEvent
                                    {...getTimelineEventTitleProps(event)}
                                    key={id}
                                    date={date}
                                />
                            );
                        })}
                </Timeline>
            ) : (
                <Skeleton />
            )}
        </div>
    );
};

OrderHistory.displayName = "OrderHistory";

export default OrderHistory;
