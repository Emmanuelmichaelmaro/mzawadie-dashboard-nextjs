import { Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import FormSpacer from "@mzawadie/components/FormSpacer";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderSettingsFormData } from "../OrderSettingsPage/form";

export interface OrderFulfillmentSettingsProps {
    data: OrderSettingsFormData;
    disabled: boolean;
    onChange: (event: React.ChangeEvent<any>) => void;
}

const OrderFulfillmentSettings: React.FC<OrderFulfillmentSettingsProps> = ({
    data,
    disabled,
    onChange,
}) => {
    const intl = useIntl();

    return (
        <Card data-test-id="order-fulfillment-settings">
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Fulfillment settings",
                    id: "G3ay2p",
                    description: "section header",
                })}
            />

            <CardContent>
                <ControlledCheckbox
                    name={"fulfillmentAutoApprove" as keyof OrderSettingsFormData}
                    label={
                        <>
                            <FormattedMessage
                                defaultMessage="Automatically approve all fulfillments"
                                id="05hqq6"
                                description="checkbox label"
                            />
                            <Typography variant="caption">
                                <FormattedMessage
                                    defaultMessage="All fulfillments will be automatically approved"
                                    id="XwQQ1f"
                                    description="checkbox label description"
                                />
                            </Typography>
                        </>
                    }
                    checked={data.fulfillmentAutoApprove}
                    onChange={onChange}
                    disabled={disabled}
                    data-test-id="fulfillment-auto-approve-checkbox"
                />

                <FormSpacer />

                <ControlledCheckbox
                    name={"fulfillmentAllowUnpaid" as keyof OrderSettingsFormData}
                    label={
                        <>
                            <FormattedMessage
                                defaultMessage="Allow fulfillment without payment"
                                id="2MKkgX"
                                description="checkbox label"
                            />
                            <Typography variant="caption">
                                <FormattedMessage
                                    defaultMessage="You will be able to fulfill products without capturing payment for the order."
                                    id="l9ETHu"
                                    description="checkbox label description"
                                />
                            </Typography>
                        </>
                    }
                    checked={data.fulfillmentAllowUnpaid}
                    onChange={onChange}
                    disabled={disabled}
                    data-test-id="fulfillment-allow-unpaid-checkbox"
                />
            </CardContent>
        </Card>
    );
};

OrderFulfillmentSettings.displayName = "OrderFulfillmentSettings";

export default OrderFulfillmentSettings;
