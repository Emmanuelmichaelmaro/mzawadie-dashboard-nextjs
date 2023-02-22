// @ts-nocheck
import { DialogContent, Divider, TextField } from "@material-ui/core";
import DialogButtons from "@mzawadie/components/ActionDialog/DialogButtons";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { commonMessages } from "@mzawadie/core";
import { GiftCardError } from "@mzawadie/fragments/types/GiftCardError";
import useForm from "@mzawadie/hooks/useForm";
import { VerticalSpacer } from "@mzawadie/pages/apps/components/VerticalSpacer";
import { Label } from "@mzawadie/pages/orders/components/OrderHistory/Label";
import { GiftCardSettingsExpiryTypeEnum, TimePeriodTypeEnum } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import GiftCardSendToCustomer from "../GiftCardSendToCustomer/GiftCardSendToCustomer";
import { useGiftCardSettingsQuery } from "../GiftCardSettings/queries";
import { GiftCardTagInput } from "../GiftCardTagInput";
import { GiftCardCreateExpirySelect } from "./GiftCardCreateExpirySelect";
import GiftCardCreateMoneyInput from "./GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "./GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as messages } from "./messages";
import { useGiftCardCreateFormStyles as useStyles } from "./styles";
import { GiftCardCreateFormCommonProps, GiftCardCreateFormCustomer } from "./types";

export interface GiftCardCreateFormData extends GiftCardCreateCommonFormData {
    note: string;
    sendToCustomerSelected: boolean;
    selectedCustomer?: GiftCardCreateFormCustomer;
    channelSlug?: string;
}

export const initialData: GiftCardCreateFormData = {
    tags: [],
    balanceAmount: 1,
    balanceCurrency: null,
    note: "",
    sendToCustomerSelected: false,
    expirySelected: false,
    expiryType: "EXPIRY_PERIOD",
    expiryDate: "",
    expiryPeriodType: TimePeriodTypeEnum.MONTH,
    expiryPeriodAmount: 12,
    requiresActivation: true,
};
interface GiftCardCreateDialogFormProps {
    opts: { status: ConfirmButtonTransitionState };
    apiErrors: GiftCardError[];
    onSubmit: (data: GiftCardCreateFormData) => void;
    onClose: () => void;
    initialCustomer?: GiftCardCreateFormCustomer | null;
}

const defaultInitialCustomer = { email: "", name: "" };

const GiftCardCreateDialogForm: React.FC<GiftCardCreateDialogFormProps> = ({
    onSubmit,
    opts,
    onClose,
    apiErrors,
    initialCustomer,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    const { data: settingsData, loading: loadingSettings } = useGiftCardSettingsQuery();

    const [selectedCustomer, setSelectedCustomer] = useState<GiftCardCreateFormCustomer>(
        initialCustomer || defaultInitialCustomer
    );

    const handleSubmit = (data: GiftCardCreateFormData) => onSubmit({ ...data, selectedCustomer });

    const getInitialExpirySettingsData = (): Partial<GiftCardCreateFormData> => {
        if (loadingSettings) {
            return {};
        }

        const { expiryType, expiryPeriod } = settingsData?.giftCardSettings;

        if (expiryType === GiftCardSettingsExpiryTypeEnum.NEVER_EXPIRE) {
            return {};
        }

        return {
            expiryType,
            expiryPeriodType: expiryPeriod?.type,
            expiryPeriodAmount: expiryPeriod?.amount,
        };
    };

    const { submit, change, toggleValue, data, set } = useForm(
        {
            ...initialData,
            ...getInitialExpirySettingsData(),
            balanceCurrency: "",
            channelSlug: "",
            sendToCustomerSelected: !!initialCustomer,
        },
        handleSubmit
    );

    const formErrors = getFormErrors(
        ["tags", "expiryDate", "customer", "currency", "amount", "balance"],
        apiErrors
    );

    const {
        tags,
        sendToCustomerSelected,
        channelSlug,
        balanceAmount,
        expirySelected,
        expiryType,
        expiryDate,
        requiresActivation,
    } = data;

    const shouldEnableSubmitButton = () => {
        if (!balanceAmount) {
            return false;
        }

        if (expirySelected && expiryType === "EXPIRY_DATE") {
            return !!expiryDate;
        }

        return true;
    };

    const commonFormProps: GiftCardCreateFormCommonProps = {
        data,
        errors: formErrors,
        toggleValue,
        change,
    };

    return (
        <>
            <DialogContent className={classes.dialogContent}>
                <GiftCardCreateMoneyInput {...commonFormProps} set={set} />
                <CardSpacer />
                <GiftCardTagInput
                    error={formErrors?.tags}
                    name="tags"
                    values={tags}
                    toggleChange={toggleValue}
                />
                <CardSpacer />
                <Divider />
                <GiftCardSendToCustomer
                    selectedChannelSlug={channelSlug}
                    change={change}
                    sendToCustomerSelected={sendToCustomerSelected}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    disabled={!!initialCustomer}
                />
                <Divider />
                <VerticalSpacer />
                <GiftCardCreateExpirySelect {...commonFormProps} />
                <VerticalSpacer />
                <TextField
                    name="note"
                    onChange={change}
                    multiline
                    className={classes.noteField}
                    label={`${intl.formatMessage(messages.noteLabel)} *${intl.formatMessage(
                        commonMessages.optionalField
                    )}`}
                />
                <VerticalSpacer />
                <Label text={intl.formatMessage(messages.noteSubtitle)} />
                <VerticalSpacer spacing={2} />
                <GiftCardCreateRequiresActivationSection
                    onChange={change}
                    checked={requiresActivation}
                />
            </DialogContent>
            <DialogButtons
                disabled={!shouldEnableSubmitButton()}
                onConfirm={submit}
                confirmButtonLabel={intl.formatMessage(messages.issueButtonLabel)}
                confirmButtonState={opts?.status}
                onClose={onClose}
            />
        </>
    );
};

export default GiftCardCreateDialogForm;
