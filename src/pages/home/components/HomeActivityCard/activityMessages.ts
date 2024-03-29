// @ts-nocheck
import { HomeQuery, OrderEventsEnum } from "@mzawadie/graphql";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
    draft: {
        defaultMessage: "Order #{orderId} was placed from draft by {userEmail}",
        id: "sjRXXz",
    },
    draft_no_email: {
        defaultMessage: "Order #{orderId} was placed from draft",
        id: "BNTZLv",
    },
    paid: {
        defaultMessage: "Order #{orderId} was fully paid",
        id: "5SPHkk",
    },
    placed: {
        defaultMessage: "Order #{orderId} was placed",
        id: "0dPP8O",
    },
});

export const getActivityMessage = (
    activity: HomeQuery["activities"]["edges"][0]["node"],
    intl: IntlShape
) => {
    switch (activity.type) {
        case OrderEventsEnum.ORDER_FULLY_PAID:
            return intl.formatMessage(messages.paid, {
                orderId: activity.orderNumber,
            });
        case OrderEventsEnum.PLACED:
            return intl.formatMessage(messages.placed, {
                orderId: activity.orderNumber,
            });
        case OrderEventsEnum.PLACED_FROM_DRAFT:
            if (!!activity.user?.email) {
                return intl.formatMessage(messages.draft, {
                    orderId: activity.orderNumber,
                    userEmail: activity.user?.email,
                });
            }
            return intl.formatMessage(messages.draft_no_email, {
                orderId: activity.orderNumber,
            });

        default:
            return activity.message;
    }
};
