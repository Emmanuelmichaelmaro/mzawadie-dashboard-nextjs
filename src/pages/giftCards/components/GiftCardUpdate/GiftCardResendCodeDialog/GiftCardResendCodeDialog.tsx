// @ts-nocheck
import { CircularProgress, TextField, Typography } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { useChannelsSearch } from "@mzawadie/components/ChannelsAvailabilityDialog/utils";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import { IMessage } from "@mzawadie/components/Messages";
import { SingleAutocompleteSelectField } from "@mzawadie/components/SingleAutocompleteSelectField";
import { DialogProps } from "@mzawadie/core";
import { useGiftCardResendMutation, useChannelsQuery } from "@mzawadie/graphql";
import useForm from "@mzawadie/hooks/useForm";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { VerticalSpacer } from "@mzawadie/pages/apps/components/VerticalSpacer";
import { getBySlug } from "@mzawadie/pages/products/components/ProductVariantCreatorPage/utils";
import commonErrorMessages from "@mzawadie/utils/errors/common";
import { mapSlugNodeToChoice } from "@mzawadie/utils/maps";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { useGiftCardDeleteDialogContentStyles as useProgressStyles } from "../../GiftCardDeleteDialog/styles";
import { useUpdateBalanceDialogStyles as useStyles } from "../GiftCardUpdateBalanceDialog/styles";
import { getGiftCardErrorMessage } from "../messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardResendCodeDialogMessages as messages } from "./messages";
import { useDialogFormReset } from "./utils";

export interface GiftCardResendCodeFormData {
    email: string;
    channelSlug: string;
}

const GiftCardResendCodeDialog: React.FC<DialogProps> = ({ open, onClose }) => {
    const intl = useIntl();
    const notify = useNotifier();
    const classes = useStyles();
    const progressClasses = useProgressStyles();

    const {
        giftCard: { boughtInChannel: initialChannelSlug },
    } = useGiftCardDetails();

    const [consentSelected, setConsentSelected] = useState(false);

    const { data: channelsData, loading: loadingChannels } = useChannelsQuery({});

    const channels = channelsData?.channels;

    const activeChannels = channels?.filter(({ isActive }) => isActive);

    const { onQueryChange, filteredChannels } = useChannelsSearch(activeChannels);

    const initialFormData: GiftCardResendCodeFormData = {
        email: "",
        channelSlug: initialChannelSlug || "",
    };

    const {
        giftCard: { id },
    } = useGiftCardDetails();

    const handleSubmit = async ({ email, channelSlug }: GiftCardResendCodeFormData) => {
        const result = await resendGiftCardCode({
            variables: {
                input: {
                    id,
                    email: email || null,
                    channel: channelSlug,
                },
            },
        });

        return result?.data?.giftCardResend?.errors;
    };

    const { data, change, submit, reset } = useForm(initialFormData, handleSubmit);

    const onCompleted = (data: GiftCardResend) => {
        const errors = data?.giftCardResend?.errors;

        const notifierData: IMessage = !!errors?.length
            ? {
                  status: "error",
                  text: intl.formatMessage(commonErrorMessages.unknownError),
              }
            : {
                  status: "success",
                  text: intl.formatMessage(messages.successResendAlertText),
              };

        notify(notifierData);

        if (!errors.length) {
            onClose();
            reset();
        }
    };

    const [resendGiftCardCode, resendGiftCardCodeOpts] = useGiftCardResendMutation({
        onCompleted,
    });

    const { loading, status, data: submitData } = resendGiftCardCodeOpts;

    const { formErrors } = useDialogFormReset({
        open,
        reset,
        apiErrors: submitData?.giftCardResend?.errors,
        keys: ["email"],
    });

    useEffect(reset, [consentSelected]);

    return (
        <ActionDialog
            maxWidth="sm"
            open={open}
            onConfirm={submit}
            confirmButtonLabel={intl.formatMessage(messages.submitButtonLabel)}
            onClose={onClose}
            title={intl.formatMessage(messages.title)}
            confirmButtonState={status}
            disabled={loading}
        >
            {loadingChannels ? (
                <div className={progressClasses.progressContainer}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <Typography>{intl.formatMessage(messages.description)}</Typography>
                    <VerticalSpacer />
                    <SingleAutocompleteSelectField
                        choices={mapSlugNodeToChoice(filteredChannels)}
                        name="channelSlug"
                        label={intl.formatMessage(messages.sendToChannelSelectLabel)}
                        value={data?.channelSlug}
                        onChange={change}
                        displayValue={channels.find(getBySlug(data?.channelSlug))?.name}
                        fetchChoices={onQueryChange}
                    />
                    <VerticalSpacer />
                    <ControlledCheckbox
                        name="differentMailConsent"
                        label={intl.formatMessage(messages.consentCheckboxLabel)}
                        checked={consentSelected}
                        onChange={(event: React.ChangeEvent<any>) =>
                            setConsentSelected(event.target.value)
                        }
                    />
                    <VerticalSpacer />
                    <TextField
                        disabled={!consentSelected}
                        error={!!formErrors?.email}
                        helperText={getGiftCardErrorMessage(formErrors?.email, intl)}
                        name="email"
                        value={data.email}
                        onChange={change}
                        className={classes.inputContainer}
                        label={intl.formatMessage(messages.emailInputPlaceholder)}
                    />
                </>
            )}
        </ActionDialog>
    );
};

export default GiftCardResendCodeDialog;
