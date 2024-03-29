// @ts-nocheck
import { CircularProgress, DialogContentText, Typography } from "@material-ui/core";
import { ActionDialog, ActionDialogProps } from "@mzawadie/components/ActionDialog";
import DeleteWarningDialogConsentContent from "@mzawadie/components/TypeDeleteWarningDialog/DeleteWarningDialogConsentContent";
import { GiftCardDataFragment } from "@mzawadie/graphql";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ExtendedGiftCard } from "../GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { UseGiftCardListProps } from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import { UseGiftCardListBulkActionsProps } from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { giftCardDeleteDialogMessages as messages } from "./messages";
import { useGiftCardDeleteDialogContentStyles as useStyles } from "./styles";

export const SINGLE = 1;

type DeleteDialogContentGiftCard = Pick<
    ExtendedGiftCard<GiftCardDataFragment>,
    "currentBalance" | "id"
>;

export interface GiftCardDeleteDialogContentProps<TGiftCard extends DeleteDialogContentGiftCard>
    extends Pick<ActionDialogProps, "open" | "onClose" | "onConfirm" | "confirmButtonState">,
        Partial<Pick<UseGiftCardListProps, "giftCards" | "loading">>,
        Partial<Pick<UseGiftCardListBulkActionsProps, "listElements" | "selectedItemsCount">> {
    id?: string;
    giftCard?: TGiftCard;
    singleDeletion: boolean;
}

function GiftCardDeleteDialogContent<TGiftCard extends DeleteDialogContentGiftCard>({
    id,
    open,
    onClose,
    onConfirm,
    confirmButtonState,
    singleDeletion,
    selectedItemsCount: listSelectedItemsCount,
    listElements,
    giftCards,
    giftCard,
    loading,
}: GiftCardDeleteDialogContentProps<TGiftCard>) {
    const intl = useIntl();
    const classes = useStyles({});

    const [isConsentChecked, setConsentChecked] = useState(false);

    const selectedItemsCount = listSelectedItemsCount || SINGLE;

    useEffect(() => {
        if (!open) {
            setConsentChecked(false);
        }
    }, [open]);

    const hasSelectedAnyGiftCardsWithBalance = () => {
        if (!giftCards) {
            return false;
        }

        return listElements?.some(hasSelectedGiftCardBalance);
    };

    const hasSelectedGiftCardBalance = (id: string) => {
        const card = giftCards?.find(getById(id)) || giftCard;

        return card?.currentBalance?.amount > 0;
    };

    const deletingCardsWithBalance = singleDeletion
        ? hasSelectedGiftCardBalance(id)
        : hasSelectedAnyGiftCardsWithBalance();

    const submitEnabled = deletingCardsWithBalance ? isConsentChecked : true;

    return (
        <ActionDialog
            open={open}
            onClose={onClose}
            variant="delete"
            title={intl.formatMessage(messages.title, { selectedItemsCount })}
            onConfirm={onConfirm}
            confirmButtonState={confirmButtonState}
            disabled={!submitEnabled}
        >
            {loading ? (
                <div className={classes.progressContainer}>
                    <CircularProgress />
                </div>
            ) : deletingCardsWithBalance ? (
                <DeleteWarningDialogConsentContent
                    isConsentChecked={isConsentChecked}
                    onConsentChange={setConsentChecked}
                    description={intl.formatMessage(messages.withBalanceDescription, {
                        selectedItemsCount,
                    })}
                    consentLabel={intl.formatMessage(messages.consentLabel, {
                        selectedItemsCount,
                    })}
                />
            ) : (
                <DialogContentText>
                    <Typography>
                        {intl.formatMessage(messages.defaultDescription, {
                            selectedItemsCount,
                        })}
                    </Typography>
                </DialogContentText>
            )}
        </ActionDialog>
    );
}

export default GiftCardDeleteDialogContent;
