import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import Hr from "@mzawadie/components/Hr";
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import { WebhookEventTypeEnum } from "@mzawadie/types/globalTypes";
import { toggle } from "@mzawadie/utils/lists";
import React from "react";
import { useIntl } from "react-intl";

interface WebhookEventsProps {
    data: {
        allEvents: boolean;
        events: string[];
    };
    disabled: boolean;
    onChange: (event: ChangeEvent, cb?: () => void) => void;
}

const WebhookEvents: React.FC<WebhookEventsProps> = ({ data, disabled, onChange }) => {
    const intl = useIntl();
    const eventsEnum = Object.values(WebhookEventTypeEnum);

    const translatedEvents: Record<WebhookEventTypeEnum, string> = {
        [WebhookEventTypeEnum.ANY_EVENTS]: intl.formatMessage({
            defaultMessage: "All events",
            id: "RrZYME",
            description: "event",
        }),
        [WebhookEventTypeEnum.CHECKOUT_CREATED]: intl.formatMessage({
            defaultMessage: "Checkout created",
            id: "OA5hu8",
            description: "event",
        }),
        [WebhookEventTypeEnum.CHECKOUT_UPDATED]: intl.formatMessage({
            defaultMessage: "Checkout updated",
            id: "P3e0J8",
            description: "event",
        }),
        [WebhookEventTypeEnum.CUSTOMER_CREATED]: intl.formatMessage({
            defaultMessage: "Customer created",
            id: "9xcy2J",
            description: "event",
        }),
        [WebhookEventTypeEnum.CUSTOMER_UPDATED]: intl.formatMessage({
            defaultMessage: "Customer updated",
            id: "CT5fFW",
            description: "event",
        }),
        [WebhookEventTypeEnum.CHECKOUT_CREATED]: intl.formatMessage({
            defaultMessage: "Checkout created",
            id: "OA5hu8",
            description: "event",
        }),
        [WebhookEventTypeEnum.CHECKOUT_UPDATED]: intl.formatMessage({
            defaultMessage: "Checkout updated",
            id: "P3e0J8",
            description: "event",
        }),
        [WebhookEventTypeEnum.ORDER_CANCELLED]: intl.formatMessage({
            defaultMessage: "Order cancelled",
            id: "/BlXhU",
            description: "event",
        }),
        [WebhookEventTypeEnum.ORDER_CREATED]: intl.formatMessage({
            defaultMessage: "Order created",
            id: "odB08s",
            description: "event",
        }),
        [WebhookEventTypeEnum.ORDER_CONFIRMED]: intl.formatMessage({
            defaultMessage: "Order confirmed",
            id: "D19Erm",
            description: "event",
        }),
        [WebhookEventTypeEnum.ORDER_FULFILLED]: intl.formatMessage({
            defaultMessage: "Order fulfilled",
            id: "OS2bVD",
            description: "event",
        }),
        [WebhookEventTypeEnum.ORDER_FULLY_PAID]: intl.formatMessage({
            defaultMessage: "Order fully paid",
            id: "ccRHBV",
            description: "event",
        }),
        [WebhookEventTypeEnum.ORDER_UPDATED]: intl.formatMessage({
            defaultMessage: "Order updated",
            id: "P5GKo4",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAGE_CREATED]: intl.formatMessage({
            defaultMessage: "Page created",
            id: "tjAWvw",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAGE_DELETED]: intl.formatMessage({
            defaultMessage: "Page deleted",
            id: "8PYN4w",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAGE_UPDATED]: intl.formatMessage({
            defaultMessage: "Page updated",
            id: "ovRcH7",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAYMENT_AUTHORIZE]: intl.formatMessage({
            defaultMessage: "Authorize payment",
            id: "zG7DDH",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAYMENT_CAPTURE]: intl.formatMessage({
            defaultMessage: "Capture payment",
            id: "NZbUEE",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAYMENT_CONFIRM]: intl.formatMessage({
            defaultMessage: "Confirm payment",
            id: "OYaVVk",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAYMENT_LIST_GATEWAYS]: intl.formatMessage({
            defaultMessage: "List payment gateways",
            id: "gkdNcW",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAYMENT_PROCESS]: intl.formatMessage({
            defaultMessage: "Process payment",
            id: "JvtaTu",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAYMENT_REFUND]: intl.formatMessage({
            defaultMessage: "Refund payment",
            id: "4nIMbD",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAYMENT_VOID]: intl.formatMessage({
            defaultMessage: "Void payment",
            id: "EeAaOf",
            description: "event",
        }),
        [WebhookEventTypeEnum.PRODUCT_CREATED]: intl.formatMessage({
            defaultMessage: "Product created",
            id: "U3yQDc",
            description: "event",
        }),
        [WebhookEventTypeEnum.PRODUCT_UPDATED]: intl.formatMessage({
            defaultMessage: "Product updated",
            id: "nivwwr",
            description: "event",
        }),
        [WebhookEventTypeEnum.PRODUCT_DELETED]: intl.formatMessage({
            defaultMessage: "Product deleted",
            id: "Na8m6z",
            description: "event",
        }),
        [WebhookEventTypeEnum.PRODUCT_VARIANT_CREATED]: intl.formatMessage({
            defaultMessage: "Product variant created",
            id: "yQ9l8W",
            description: "event",
        }),
        [WebhookEventTypeEnum.PRODUCT_VARIANT_UPDATED]: intl.formatMessage({
            defaultMessage: "Product variant updated",
            id: "DOOZtY",
            description: "event",
        }),
        [WebhookEventTypeEnum.PRODUCT_VARIANT_DELETED]: intl.formatMessage({
            defaultMessage: "Product variant deleted",
            id: "f4Mbwk",
            description: "event",
        }),
        [WebhookEventTypeEnum.FULFILLMENT_CREATED]: intl.formatMessage({
            defaultMessage: "Fulfillment created",
            id: "oiiM3u",
            description: "event",
        }),
        [WebhookEventTypeEnum.INVOICE_REQUESTED]: intl.formatMessage({
            defaultMessage: "Invoice requested",
            id: "0IUAIK",
            description: "event",
        }),
        [WebhookEventTypeEnum.INVOICE_SENT]: intl.formatMessage({
            defaultMessage: "Invoice sent",
            id: "z1tTCq",
            description: "event",
        }),
        [WebhookEventTypeEnum.INVOICE_DELETED]: intl.formatMessage({
            defaultMessage: "Invoice deleted",
            id: "Q8W5Fk",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAGE_CREATED]: intl.formatMessage({
            defaultMessage: "Page created",
            id: "tjAWvw",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAGE_UPDATED]: intl.formatMessage({
            defaultMessage: "Page updated",
            id: "ovRcH7",
            description: "event",
        }),
        [WebhookEventTypeEnum.PAGE_DELETED]: intl.formatMessage({
            defaultMessage: "Page deleted",
            id: "8PYN4w",
            description: "event",
        }),
        [WebhookEventTypeEnum.NOTIFY_USER]: intl.formatMessage({
            defaultMessage: "User notified",
            id: "XPOSOs",
            description: "event",
        }),
        [WebhookEventTypeEnum.TRANSLATION_CREATED]: intl.formatMessage({
            defaultMessage: "Translation created",
            id: "fWu6k3",
            description: "event",
        }),
        [WebhookEventTypeEnum.TRANSLATION_UPDATED]: intl.formatMessage({
            defaultMessage: "Translation updated",
            id: "ywbAO1",
            description: "event",
        }),
    };

    const handleEventsChange = (event: ChangeEvent) =>
        onChange({
            target: {
                name: "events",
                value: toggle(event.target.name, data.events, (a, b) => a === b),
            },
        });

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Events",
                    id: "GLewww",
                    description: "section header",
                })}
            />
            <CardContent>
                <Typography>
                    {intl.formatMessage({
                        defaultMessage:
                            "Expand or restrict webhooks permissions to register certain events in Saleor system.",
                        id: "FMBNP2",
                        description: "webhook events",
                    })}
                </Typography>
                <ControlledCheckbox
                    checked={data.allEvents}
                    disabled={disabled}
                    label={translatedEvents.ANY_EVENTS}
                    name="allEvents"
                    onChange={onChange}
                />
                {!data.allEvents && (
                    <>
                        <Hr />
                        {eventsEnum.slice(1).map((event) => (
                            <div key={event}>
                                <ControlledCheckbox
                                    checked={data.events.includes(event)}
                                    disabled={disabled}
                                    label={translatedEvents[event]}
                                    name={event}
                                    onChange={handleEventsChange}
                                />
                            </div>
                        ))}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

WebhookEvents.displayName = "WebhookEvents";

export default WebhookEvents;
