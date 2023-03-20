import { Typography } from "@material-ui/core";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import { GiftCardSettingsErrorFragment, TimePeriodTypeEnum } from "@mzawadie/graphql";
import { FormChange } from "@mzawadie/hooks/useForm";
import { VerticalSpacer } from "@mzawadie/pages/apps/components/VerticalSpacer";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getGiftCardSettingsErrorMessage } from "../GiftCardSettings/messages";
import TimePeriodField from "../TimePeriodField/TimePeriodField";
import { giftCardSettingsExpirySelectMessages as messages } from "./messages";

export interface GiftCardSettingsExpirySelectProps {
    change: FormChange;
    disabled: boolean;
    expiryPeriodActive: boolean;
    expiryPeriodType: TimePeriodTypeEnum;
    expiryPeriodAmount: number;
    errors?: Record<"expiryPeriod", GiftCardSettingsErrorFragment>;
}

const GiftCardSettingsExpirySelect: React.FC<GiftCardSettingsExpirySelectProps> = ({
    errors,
    change,
    disabled,
    expiryPeriodActive,
    expiryPeriodType,
    expiryPeriodAmount,
}) => {
    const intl = useIntl();

    return (
        <>
            <ControlledCheckbox
                name="expiryPeriodActive"
                label={
                    <>
                        <FormattedMessage {...messages.setExpirationPeriodTitle} />
                        <Typography variant="caption">
                            <FormattedMessage {...messages.setExpirationPeriodDescription} />
                        </Typography>
                    </>
                }
                checked={expiryPeriodActive}
                onChange={change}
                disabled={disabled}
                data-test-id="expiry-period-active"
            />

            {expiryPeriodActive && (
                <>
                    <VerticalSpacer spacing={2} />
                    <TimePeriodField
                        isError={!!errors?.expiryPeriod}
                        helperText={getGiftCardSettingsErrorMessage(errors?.expiryPeriod, intl)}
                        change={change}
                        periodType={expiryPeriodType}
                        periodAmount={expiryPeriodAmount}
                        amountFieldName="expiryPeriodAmount"
                        typeFieldName="expiryPeriodType"
                    />
                </>
            )}
        </>
    );
};

export default GiftCardSettingsExpirySelect;
