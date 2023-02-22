import { ActionDialogProps } from "@mzawadie/components/ActionDialog";
import { DialogProps } from "@mzawadie/core";
import React from "react";

import useGiftCardListDialogs from "../GiftCardsList/providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { GIFT_CARD_LIST_QUERY } from "../GiftCardsList/types";
import GiftCardDeleteDialogContent, { SINGLE } from "./GiftCardDeleteDialogContent";
import useGiftCardBulkDelete from "./useGiftCardBulkDelete";
import useGiftCardSingleDelete from "./useGiftCardSingleDelete";

interface GiftCardDeleteDialogProps extends DialogProps {
    refetchQueries?: string[];
}

const GiftCardDeleteDialog: React.FC<GiftCardDeleteDialogProps> = ({
    open,
    onClose,
    refetchQueries = [],
}) => {
    const giftCardBulkActionsProps = useGiftCardListBulkActions();
    const { selectedItemsCount } = giftCardBulkActionsProps;

    const { giftCards, loading } = useGiftCardList();

    const { id } = useGiftCardListDialogs();

    const singleDeletion = !!id || selectedItemsCount === SINGLE;

    const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
        id,
        onClose,
        refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
    });

    const { onBulkDeleteGiftCards, bulkDeleteGiftCardOpts } = useGiftCardBulkDelete({
        onClose,
        refetchQueries: [GIFT_CARD_LIST_QUERY, ...refetchQueries],
    });

    const dialogProps: Pick<ActionDialogProps, "onConfirm" | "confirmButtonState"> = !!id
        ? {
              onConfirm: onDeleteGiftCard,
              confirmButtonState: deleteGiftCardOpts?.status,
          }
        : {
              onConfirm: onBulkDeleteGiftCards,
              confirmButtonState: bulkDeleteGiftCardOpts?.status,
          };

    return (
        <GiftCardDeleteDialogContent
            id={id}
            open={open}
            onClose={onClose}
            singleDeletion={singleDeletion}
            giftCards={giftCards}
            loading={loading}
            {...giftCardBulkActionsProps}
            {...dialogProps}
        />
    );
};

export default GiftCardDeleteDialog;
