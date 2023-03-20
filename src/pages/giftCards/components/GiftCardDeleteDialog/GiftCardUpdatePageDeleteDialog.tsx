// @ts-nocheck
import { DialogProps } from "@mzawadie/core";
import { GIFT_CARD_LIST_QUERY } from "@mzawadie/pages/giftCards/components/GiftCardsList/queries";
import React from "react";

import useGiftCardDetails from "../GiftCardUpdate/providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { GiftCardUpdateDialogsConsumerProps } from "../GiftCardUpdate/providers/GiftCardUpdateDialogsProvider";
import GiftCardDeleteDialogContent from "./GiftCardDeleteDialogContent";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

type GiftCardUpdatePageDeleteDialogProps = DialogProps &
    Pick<GiftCardUpdateDialogsConsumerProps, "navigateBack">;

const GiftCardUpdatePageDeleteDialog: React.FC<GiftCardUpdatePageDeleteDialogProps> = ({
    onClose,
    open,
    navigateBack,
}) => {
    const { giftCard } = useGiftCardDetails();

    const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
        id: giftCard?.id,
        onClose,
        onSuccess: navigateBack,
        refetchQueries: [GIFT_CARD_LIST_QUERY],
    });

    return (
        <GiftCardDeleteDialogContent
            singleDeletion
            giftCard={giftCard}
            open={open}
            onClose={onClose}
            onConfirm={onDeleteGiftCard}
            confirmButtonState={deleteGiftCardOpts?.status}
        />
    );
};

export default GiftCardUpdatePageDeleteDialog;
