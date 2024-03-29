// @ts-nocheck
import { TimelineEvent } from "@mzawadie/components/Timeline";
import { TitleElement } from "@mzawadie/components/Timeline/TimelineEventHeader";
import { OrderEventFragment, OrderEventsEnum } from "@mzawadie/graphql";
import { orderUrl } from "@mzawadie/pages/orders/urls";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { getEmployeeNameLink } from "./utils";

export const replacementCreatedMessages = defineMessages({
    description: {
        defaultMessage: "was created for replaced products",
        id: "kvSYZh",
        description: "replacement created order history message description",
    },
    draftNumber: {
        defaultMessage: "Draft #{orderNumber} ",
        id: "kkIw+l",
        description: "replacement created order history message draft number",
    },
});

export const discountRemovedMessages = defineMessages({
    orderDiscountRemoved: {
        defaultMessage: "Order discount was removed by ",
        id: "KXkdMH",
        description: "order discount removed title",
    },
    productDiscountRemoved: {
        defaultMessage: "{productName} discount was removed by",
        id: "A0Wlg7",
        description: "product discount removed title",
    },
});

interface LinkedTimelineEventProps {
    event: OrderEventFragment;
}

const LinkedTimelineEvent: React.FC<LinkedTimelineEventProps> = ({ event }) => {
    const intl = useIntl();

    const getTitleElements = (): TitleElement[] => {
        const { type, relatedOrder, lines } = event;

        switch (type) {
            case OrderEventsEnum.ORDER_REPLACEMENT_CREATED: {
                return [
                    {
                        link: orderUrl(relatedOrder?.id),
                        text: intl.formatMessage(replacementCreatedMessages.draftNumber, {
                            orderNumber: relatedOrder?.number,
                        }),
                    },
                    { text: intl.formatMessage(replacementCreatedMessages.description) },
                ];
            }
            case OrderEventsEnum.ORDER_DISCOUNT_DELETED: {
                return [
                    {
                        text: intl.formatMessage(discountRemovedMessages.orderDiscountRemoved),
                    },
                    getEmployeeNameLink(event),
                ];
            }
            case OrderEventsEnum.ORDER_LINE_DISCOUNT_REMOVED: {
                return [
                    {
                        text: intl.formatMessage(discountRemovedMessages.productDiscountRemoved, {
                            productName: lines[0].itemName,
                        }),
                    },
                    getEmployeeNameLink(event),
                ];
            }
        }
    };

    return <TimelineEvent titleElements={getTitleElements()} date={event.date} />;
};

export default LinkedTimelineEvent;
