// @ts-nocheck
import Link from "@mzawadie/components/Link";
import { TimelineEvent } from "@mzawadie/components/Timeline";
import { appPath } from "@mzawadie/pages/apps/urls";
import { customerPath } from "@mzawadie/pages/customers/urls";
import { orderUrl } from "@mzawadie/pages/orders/urls";
import { staffMemberDetailsUrl } from "@mzawadie/pages/staff/urls";
import { GiftCardEventsEnum } from "@mzawadie/types/globalTypes";
import React from "react";
import { useIntl, IntlShape } from "react-intl";

import { GiftCardDetails_giftCard_events } from "../types/GiftCardDetails";
import { giftCardHistoryTimelineMessages as timelineMessages } from "./messages";

const getUserOrApp = (event: GiftCardDetails_giftCard_events): string | null => {
    if (event.user) {
        const { firstName, lastName, email } = event.user;

        if (lastName === "" || firstName === "") {
            return email;
        }

        return `${firstName} ${lastName}`;
    }

    if (event.app) {
        return event.app.name;
    }

    return null;
};

const getEventMessage = (event: GiftCardDetails_giftCard_events, intl: IntlShape) => {
    const user = getUserOrApp(event);

    switch (event.type) {
        case GiftCardEventsEnum.ACTIVATED:
            return user
                ? intl.formatMessage(timelineMessages.activated, {
                      activatedBy: <Link href={staffMemberDetailsUrl(event.user.id)}>{user}</Link>,
                  })
                : intl.formatMessage(timelineMessages.activatedAnonymous);
        case GiftCardEventsEnum.BALANCE_RESET:
            return user
                ? intl.formatMessage(timelineMessages.balanceReset, {
                      resetBy: <Link href={staffMemberDetailsUrl(event.user.id)}>{user}</Link>,
                  })
                : intl.formatMessage(timelineMessages.balanceResetAnonymous);
        case GiftCardEventsEnum.BOUGHT:
            return intl.formatMessage(timelineMessages.bought, {
                orderNumber: <Link href={orderUrl(event.orderId)}>#{event.orderNumber}</Link>,
            });
        case GiftCardEventsEnum.DEACTIVATED:
            return user
                ? intl.formatMessage(timelineMessages.deactivated, {
                      deactivatedBy: <Link href={staffMemberDetailsUrl(event.user.id)}>{user}</Link>,
                  })
                : intl.formatMessage(timelineMessages.deactivatedAnonymous);
        case GiftCardEventsEnum.EXPIRY_DATE_UPDATED:
            return user
                ? intl.formatMessage(timelineMessages.expiryDateUpdate, {
                      expiryUpdatedBy: <Link href={staffMemberDetailsUrl(event.user.id)}>{user}</Link>,
                  })
                : intl.formatMessage(timelineMessages.expiryDateUpdateAnonymous);
        case GiftCardEventsEnum.ISSUED:
            return user
                ? intl.formatMessage(timelineMessages.issued, {
                      issuedBy: <Link href={staffMemberDetailsUrl(event.user.id)}>{user}</Link>,
                  })
                : intl.formatMessage(timelineMessages.issuedAnonymous);
        case GiftCardEventsEnum.RESENT:
            return intl.formatMessage(timelineMessages.resent);
        case GiftCardEventsEnum.SENT_TO_CUSTOMER:
            return intl.formatMessage(timelineMessages.sentToCustomer);
        case GiftCardEventsEnum.TAGS_UPDATED:
            return intl.formatMessage(timelineMessages.tagsUpdated);
        case GiftCardEventsEnum.UPDATED:
            return intl.formatMessage(timelineMessages.tagsUpdated);
        case GiftCardEventsEnum.USED_IN_ORDER:
            return user
                ? intl.formatMessage(timelineMessages.usedInOrder, {
                      orderLink: <Link href={orderUrl(event.orderId)}>#{event.orderNumber}</Link>,
                      buyer: (content) =>
                          !!user && (
                              <Link
                                  href={
                                      event.user ? customerPath(event.user.id) : appPath(event.app.id)
                                  }
                              >{`${content} ${user}`}</Link>
                          ),
                  })
                : intl.formatMessage(timelineMessages.usedInOrderAnonymous, {
                      orderLink: <Link href={orderUrl(event.orderId)}>#{event.orderNumber}</Link>,
                  });
    }
};

export interface GiftCardTimelineEventProps {
    date: string;
    event: GiftCardDetails_giftCard_events;
}

const GiftCardTimelineEvent: React.FC<GiftCardTimelineEventProps> = ({ date, event }) => {
    const intl = useIntl();
    return <TimelineEvent date={date} title={getEventMessage(event, intl)} />;
};

export default GiftCardTimelineEvent;
