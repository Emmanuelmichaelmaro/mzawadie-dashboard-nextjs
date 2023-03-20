// @ts-nocheck
import { Typography } from "@material-ui/core";
import { CardTitle as DefaultCardTitle } from "@mzawadie/components/CardTitle";
import { StatusType } from "@mzawadie/core";
import { FulfillmentStatus } from "@mzawadie/graphql";
import { makeStyles, Pill } from "@saleor/macaw-ui";
import camelCase from "lodash/camelCase";
import React from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        title: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
        },
        orderNumber: {
            display: "inline",
            marginLeft: theme.spacing(1),
        },
        warehouseName: {
            float: "right",
            alignSelf: "center",
            color: theme.palette.text.secondary,
            margin: `auto ${theme.spacing(1)} auto auto`,
        },
    }),
    { name: "CardTitle" }
);

const messages = defineMessages({
    cancelled: {
        defaultMessage: "Cancelled ({quantity})",
        id: "EtkIxE",
        description: "cancelled fulfillment, section header",
    },
    fulfilled: {
        defaultMessage: "Fulfilled ({quantity})",
        id: "iJrw63",
        description: "section header",
    },
    refunded: {
        defaultMessage: "Refunded ({quantity})",
        id: "oQhFlK",
        description: "refunded fulfillment, section header",
    },
    refundedAndReturned: {
        defaultMessage: "Refunded and Returned ({quantity})",
        id: "jNSOSu",
        description: "cancelled fulfillment, section header",
    },
    replaced: {
        defaultMessage: "Replaced ({quantity})",
        id: "3stu21",
        description: "refunded fulfillment, section header",
    },
    returned: {
        defaultMessage: "Returned ({quantity})",
        id: "eCRaHe",
        description: "refunded fulfillment, section header",
    },
    waitingForApproval: {
        defaultMessage: "Waiting for approval ({quantity})",
        id: "9ssWj+",
        description: "unapproved fulfillment, section header",
    },
    unfulfilled: {
        defaultMessage: "Unfulfilled",
        id: "/xXvjF",
        description: "section header",
    },
    fulfilledFrom: {
        defaultMessage: "Fulfilled from {warehouseName}",
        id: "ZPOyI1",
        description: "fulfilled fulfillment, section header",
    },
});

type CardTitleStatus = FulfillmentStatus | "unfulfilled";

type CardTitleLines = Array<{
    quantity: number;
}>;

interface CardTitleProps {
    lines?: CardTitleLines;
    fulfillmentOrder?: number;
    status: CardTitleStatus;
    toolbar?: React.ReactNode;
    orderNumber?: string;
    warehouseName?: string;
    withStatus?: boolean;
}

const selectStatus = (status: CardTitleStatus) => {
    switch (status) {
        case FulfillmentStatus.FULFILLED:
            return StatusType.SUCCESS;
        case FulfillmentStatus.REFUNDED:
            return StatusType.INFO;
        case FulfillmentStatus.RETURNED:
            return StatusType.INFO;
        case FulfillmentStatus.REPLACED:
            return StatusType.INFO;
        case FulfillmentStatus.REFUNDED_AND_RETURNED:
            return StatusType.INFO;
        case FulfillmentStatus.WAITING_FOR_APPROVAL:
            return StatusType.WARNING;
        case FulfillmentStatus.CANCELED:
            return StatusType.ERROR;
        default:
            return StatusType.WARNING;
    }
};

const CardTitle: React.FC<CardTitleProps> = ({
    lines = [],
    fulfillmentOrder,
    status,
    orderNumber = "",
    warehouseName,
    withStatus = false,
    toolbar,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    const fulfillmentName =
        orderNumber && fulfillmentOrder ? `#${orderNumber}-${fulfillmentOrder}` : "";

    const messageForStatus = messages[camelCase(status)] || messages.unfulfilled;

    const totalQuantity = lines.reduce((resultQuantity, { quantity }) => resultQuantity + quantity, 0);

    const title = (
        <>
            {intl.formatMessage(messageForStatus, {
                fulfillmentName,
                quantity: totalQuantity,
            })}
            {fulfillmentName && (
                <Typography className={classes.orderNumber} variant="body1">
                    {fulfillmentName}
                </Typography>
            )}
        </>
    );

    return (
        <DefaultCardTitle
            toolbar={toolbar}
            title={
                <div className={classes.title}>
                    {withStatus ? <Pill label={title} color={selectStatus(status)} /> : title}
                    {!!warehouseName && (
                        <Typography className={classes.warehouseName} variant="caption">
                            <FormattedMessage
                                {...messages.fulfilledFrom}
                                values={{
                                    warehouseName,
                                }}
                            />
                        </Typography>
                    )}
                </div>
            }
        />
    );
};

export default CardTitle;
