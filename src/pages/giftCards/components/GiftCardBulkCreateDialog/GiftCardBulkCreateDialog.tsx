// @ts-nocheck
import { Dialog, DialogTitle } from "@material-ui/core";
import { IMessage } from "@mzawadie/components/Messages";
import { DialogProps } from "@mzawadie/core";
import {
    GiftCardBulkCreateInput,
    GiftCardBulkCreateMutation,
    useChannelCurrenciesQuery,
    useGiftCardBulkCreateMutation,
} from "@mzawadie/graphql";
import useCurrentDate from "@mzawadie/hooks/useCurrentDate";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { GIFT_CARD_LIST_QUERY } from "@mzawadie/pages/giftCards/components/GiftCardsList/queries";
import { getFormErrors } from "@mzawadie/utils/errors";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import GiftCardBulkCreateSuccessDialog from "../GiftCardCreateDialog/GiftCardBulkCreateSuccessDialog";
import {
    getGiftCardCreateOnCompletedMessage,
    getGiftCardExpiryInputData,
} from "../GiftCardCreateDialog/utils";
import GiftCardBulkCreateDialogForm from "./GiftCardBulkCreateDialogForm";
import { giftCardBulkCreateDialogMessages as messages } from "./messages";
import {
    giftCardBulkCreateErrorKeys,
    GiftCardBulkCreateFormData,
    GiftCardBulkCreateFormErrors,
} from "./types";
import { validateForm } from "./utils";

const GiftCardBulkCreateDialog: React.FC<DialogProps> = ({ onClose, open }) => {
    const intl = useIntl();
    const notify = useNotifier();
    const [formErrors, setFormErrors] = useState<GiftCardBulkCreateFormErrors>(null);
    const [issuedIds, setIssuedIds] = useState<string[] | null>(null);
    const [openIssueSuccessDialog, setOpenIssueSuccessDialog] = useState<boolean>(false);

    const onIssueSuccessDialogClose = () => setOpenIssueSuccessDialog(false);

    const { loading: loadingChannelCurrencies } = useChannelCurrenciesQuery({});

    const onCompleted = (data: GiftCardBulkCreateMutation) => {
        const errors = data?.giftCardBulkCreate?.errors;
        const cardsAmount = data?.giftCardBulkCreate?.giftCards?.length || 0;

        const giftCardsBulkIssueSuccessMessage: IMessage = {
            status: "success",
            title: intl.formatMessage(messages.createdSuccessAlertTitle),
            text: intl.formatMessage(messages.createdSuccessAlertDescription, {
                cardsAmount,
            }),
        };

        notify(getGiftCardCreateOnCompletedMessage(errors, intl, giftCardsBulkIssueSuccessMessage));

        setFormErrors(getFormErrors(giftCardBulkCreateErrorKeys, errors));

        if (!errors.length) {
            setIssuedIds(data?.giftCardBulkCreate?.giftCards?.map((giftCard) => giftCard.id));
            setOpenIssueSuccessDialog(true);
            onClose();
        }
    };

    const currentDate = useCurrentDate();

    const getParsedSubmitInputData = (
        formData: GiftCardBulkCreateFormData
    ): GiftCardBulkCreateInput => {
        const { balanceAmount, balanceCurrency, tags = [], requiresActivation, cardsAmount } = formData;

        return {
            count: cardsAmount,
            tags,
            balance: {
                amount: balanceAmount,
                currency: balanceCurrency,
            },
            expiryDate: getGiftCardExpiryInputData(formData, currentDate),
            isActive: !requiresActivation,
        };
    };

    const [bulkCreateGiftCard, bulkCreateGiftCardOpts] = useGiftCardBulkCreateMutation({
        onCompleted,
        refetchQueries: [GIFT_CARD_LIST_QUERY],
    });

    const handleSubmit = (data: GiftCardBulkCreateFormData) => {
        const formErrors = validateForm(data);

        if (!!Object.keys(formErrors).length) {
            setFormErrors(formErrors);
        } else {
            bulkCreateGiftCard({
                variables: {
                    input: getParsedSubmitInputData(data),
                },
            });
        }
    };

    const apiErrors = bulkCreateGiftCardOpts?.data?.giftCardBulkCreate?.errors;

    const handleSetSchemaErrors = () => {
        if (apiErrors?.length) {
            const formErrorsFromApi = getFormErrors(giftCardBulkCreateErrorKeys, apiErrors);

            setFormErrors(formErrorsFromApi);
        }
    };

    useEffect(handleSetSchemaErrors, [apiErrors]);

    return (
        <>
            <Dialog open={open} maxWidth="sm" onClose={onClose}>
                <DialogTitle>{intl.formatMessage(messages.title)}</DialogTitle>
                <ContentWithProgress>
                    {!loadingChannelCurrencies && (
                        <GiftCardBulkCreateDialogForm
                            opts={bulkCreateGiftCardOpts}
                            onClose={onClose}
                            formErrors={formErrors}
                            onSubmit={handleSubmit}
                        />
                    )}
                </ContentWithProgress>
            </Dialog>
            <GiftCardBulkCreateSuccessDialog
                onClose={onIssueSuccessDialogClose}
                open={openIssueSuccessDialog}
                idsToExport={issuedIds}
            />
        </>
    );
};

export default GiftCardBulkCreateDialog;
