import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export const OrderLimitReached: React.FC = () => {
    const intl = useIntl();

    return (
        <LimitReachedAlert
            title={intl.formatMessage({
                defaultMessage: "Order limit reached",
                id: "+svQBN",
                description: "alert",
            })}
        >
            <FormattedMessage
                defaultMessage="You have reached your order limit,
                you will be billed extra for orders above limit.
                If you would like to up your limit,
                contact your administration staff about raising your limits."
                id="fyZmI1"
            />
        </LimitReachedAlert>
    );
};

OrderLimitReached.displayName = "OrderLimitReached";

export default OrderLimitReached;
