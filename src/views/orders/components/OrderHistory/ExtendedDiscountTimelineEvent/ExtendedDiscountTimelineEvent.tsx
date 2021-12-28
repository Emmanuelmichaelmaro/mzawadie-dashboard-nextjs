// @ts-nocheck
import { Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { TimelineEvent } from "@mzawadie/components/Timeline";
import { TitleElement } from "@mzawadie/components/Timeline/TimelineEventHeader";
import { OrderEventsEnum } from "@mzawadie/types/globalTypes";
import HorizontalSpacer from "@mzawadie/views/apps/components/HorizontalSpacer";
import { OrderDetails_order_events } from "@mzawadie/views/orders/types/OrderDetails";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import Label from "../Label";
import MoneySection, { MoneySectionType } from "./MoneySection";

const useStyles = makeStyles(
    () => ({
        horizontalContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            width: "100%",
        },
    }),
    { name: "ExtendedDiscountTimelineEvent" }
);

export const messages = defineMessages({
    reasonLabel: {
        defaultMessage: "Reason for discount",
        id: "kVOslW",
        description: "reason for discount label",
    },
});

interface ExtendedTimelineEventProps {
    event: OrderDetails_order_events;
    titleElements: TitleElement[];
}

const ExtendedDiscountTimelineEvent: React.FC<ExtendedTimelineEventProps> = ({
    event,
    titleElements,
}) => {
    const classes = useStyles({});
    const intl = useIntl();

    const { lines, date, type } = event;

    const parsedDiscount =
        type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED ? lines[0].discount : event.discount;

    const {
        valueType: calculationMode,
        value,
        reason,
        amount: moneyData,
        oldValueType: oldCalculationMode,
        oldValue,
        oldAmount: oldMoneyData,
    } = parsedDiscount;

    const shouldDisplayOldNewSections = !!oldValue;

    return (
        <TimelineEvent date={date} titleElements={titleElements}>
            {shouldDisplayOldNewSections && (
                <div className={classes.horizontalContainer}>
                    <MoneySection
                        sectionType={MoneySectionType.NEW}
                        value={value}
                        moneyData={moneyData}
                        calculationMode={calculationMode}
                    />
                    <HorizontalSpacer spacing={4} />
                    <MoneySection
                        sectionType={MoneySectionType.OLD}
                        value={oldValue}
                        moneyData={oldMoneyData}
                        calculationMode={oldCalculationMode}
                    />
                </div>
            )}

            {!shouldDisplayOldNewSections && (
                <MoneySection
                    sectionType={MoneySectionType.ONLY}
                    value={value}
                    moneyData={moneyData}
                    calculationMode={calculationMode}
                />
            )}

            <CardSpacer />
            {!!reason && (
                <>
                    <Label text={intl.formatMessage(messages.reasonLabel)} />
                    <Typography>{reason}</Typography>
                </>
            )}
        </TimelineEvent>
    );
};

export default ExtendedDiscountTimelineEvent;
