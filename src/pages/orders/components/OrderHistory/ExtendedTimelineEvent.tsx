// @ts-nocheck
import { Typography } from "@material-ui/core";
import { Money } from "@mzawadie/components/Money";
import { TimelineEvent } from "@mzawadie/components/Timeline";
import { OrderEventsEnum, OrderEventFragment } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import camelCase from "lodash/camelCase";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ExtendedDiscountTimelineEvent } from "./ExtendedDiscountTimelineEvent";
import Label from "./Label";
import {
    getEmployeeNameLink,
    getOrderNumberLink,
    hasOrderLineDiscountWithNoPreviousValue,
    isTimelineEventOfDiscountType,
} from "./utils";

const useStyles = makeStyles(
    (theme) => ({
        eventSubtitle: {
            marginBottom: theme.spacing(0.5),
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
        topSpacer: {
            marginTop: theme.spacing(3),
        },
        user: {
            marginBottom: theme.spacing(1),
        },
    }),
    { name: "OrderHistory" }
);

export const productTitles = defineMessages({
    draftCreatedFromReplace: {
        defaultMessage: "Products replaced",
        description: "draft created from replace products list title",
        id: "a1uffz",
    },
    fulfillmentRefunded: {
        defaultMessage: "Products refunded",
        description: "refunded products list title",
        id: "sHON47",
    },
    fulfillmentReplaced: {
        defaultMessage: "Products replaced",
        description: "replaced products list title",
        id: "nki0o/",
    },
    fulfillmentReturned: {
        defaultMessage: "Products returned",
        description: "returned products list title",
        id: "L5io1l",
    },
});

export const titles = defineMessages({
    draftCreatedFromReplace: {
        defaultMessage: "Draft was reissued from order ",
        description: "draft created from replace event title",
        id: "5R4VMl",
    },
    fulfillmentRefunded: {
        defaultMessage: "Products were refunded by ",
        description: "refunded event title",
        id: "VDwkEZ",
    },
    fulfillmentReplaced: {
        defaultMessage: "Products were replaced by ",
        description: "replaced event title",
        id: "1GTU/3",
    },
    fulfillmentReturned: {
        defaultMessage: "Products were returned by",
        description: "returned event title",
        id: "nayZY0",
    },
    orderDiscountAdded: {
        defaultMessage: "Order was discounted by",
        description: "order was discounted event title",
        id: "Zptsep",
    },
    orderDiscountAutomaticallyUpdated: {
        defaultMessage: "Order discount was updated automatically updated",
        description: "order discount was updated automatically event title",
        id: "AQSmqG",
    },
    orderDiscountUpdated: {
        defaultMessage: "Order discount was updated by",
        description: "order discount was updated event title",
        id: "/KWNJW",
    },
    orderLineDiscountAdded: {
        defaultMessage: "{productName} discount was added by ",
        description: "order line discount added title",
        id: "9TAzb5",
    },
    orderLineDiscountUpdated: {
        defaultMessage: "{productName} discount was updated by ",
        description: "order line discount updated title",
        id: "NgCb99",
    },
    orderMarkedAsPaid: {
        defaultMessage: "Order was marked as paid by",
        description: "order marked as paid event title",
        id: "/0JckE",
    },
});

export const messages = defineMessages({
    by: {
        defaultMessage: "by",
        description: "by preposition",
        id: "xrPv2K",
    },
    refundedAmount: {
        defaultMessage: "Refunded amount",
        description: "amount title",
        id: "nngeI3",
    },
    refundedShipment: {
        defaultMessage: "Shipment was refunded",
        description: "shipment refund title",
        id: "Krzyo+",
    },
    transactionReference: {
        defaultMessage: "Transaction reference",
        description: "transaction reference subtitle",
        id: "XWGZLL",
    },
});

interface ExtendedTimelineEventProps {
    event: OrderEventFragment;
    orderCurrency: string;
}

const ExtendedTimelineEvent: React.FC<ExtendedTimelineEventProps> = ({ event, orderCurrency }) => {
    const { id, date, type, lines, amount, transactionReference, shippingCostsIncluded } = event;
    const classes = useStyles({});
    const intl = useIntl();

    const eventTypeInCamelCase = camelCase(type);

    const getEventTitleMessageInCamelCase = () => {
        if (hasOrderLineDiscountWithNoPreviousValue(event)) {
            return titles.orderLineDiscountAdded;
        }

        return titles[eventTypeInCamelCase];
    };

    const getTitleProps = () => {
        if (type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED) {
            return { productName: lines[0]?.itemName };
        }

        return {};
    };

    const titleElements = {
        by: { text: intl.formatMessage(messages.by) },
        employeeName: getEmployeeNameLink(event),
        orderNumber: getOrderNumberLink(event),
        title: {
            text: intl.formatMessage(getEventTitleMessageInCamelCase(), getTitleProps()),
        },
    };

    const selectTitleElements = () => {
        const { title, by, employeeName, orderNumber } = titleElements;

        switch (type) {
            case OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE: {
                return [title, orderNumber, by, employeeName];
            }
            case OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED: {
                return [title];
            }
            default: {
                return [title, employeeName];
            }
        }
    };

    if (isTimelineEventOfDiscountType(type)) {
        return <ExtendedDiscountTimelineEvent event={event} titleElements={selectTitleElements()} />;
    }

    return (
        <TimelineEvent date={date} titleElements={selectTitleElements()} key={id}>
            {lines && (
                <>
                    <Label text={intl.formatMessage(productTitles[eventTypeInCamelCase])} />
                    <table>
                        <tbody>
                            {lines.map(({ orderLine, quantity, itemName }, i) => (
                                <tr key={`${itemName}-${i}`}>
                                    <td className={classes.linesTableCell}>
                                        {orderLine?.productName || itemName}
                                    </td>
                                    <td className={classes.linesTableCell}>
                                        <Label text={orderLine?.variantName} />
                                    </td>
                                    <td className={classes.linesTableCell}>
                                        <Label text={`qty: ${quantity}`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(amount || amount === 0) && (
                        <>
                            <Label text={intl.formatMessage(messages.refundedAmount)} />
                            <Money
                                money={{
                                    amount,
                                    currency: orderCurrency,
                                }}
                            />
                        </>
                    )}
                    {shippingCostsIncluded && (
                        <Typography>{intl.formatMessage(messages.refundedShipment)}</Typography>
                    )}
                </>
            )}

            {!!transactionReference && (
                <>
                    <Label text={intl.formatMessage(messages.transactionReference)} />
                    <Typography>{transactionReference}</Typography>
                </>
            )}
        </TimelineEvent>
    );
};

export default ExtendedTimelineEvent;
