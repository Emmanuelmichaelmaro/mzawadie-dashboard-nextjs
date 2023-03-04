// @ts-nocheck
import { MutationResultWithOpts } from "@mzawadie/hooks/graphql/makeMutation";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import commonErrorMessages from "@mzawadie/utils/errors/common";
import { useIntl } from "react-intl";

import { useGiftCardBulkDeleteMutation } from "../GiftCardsList/mutations";
import useGiftCardListBulkActions from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { BulkDeleteGiftCard } from "../GiftCardsList/types/BulkDeleteGiftCard";
import { giftCardDeleteDialogMessages as messages } from "./messages";

interface UseGiftCardBulkDeleteProps {
    onBulkDeleteGiftCards: () => void;
    bulkDeleteGiftCardOpts: MutationResultWithOpts<BulkDeleteGiftCard>;
}

const useGiftCardBulkDelete = ({
    onClose,
    refetchQueries,
}: {
    onClose: () => void;
    refetchQueries?: string[];
}): UseGiftCardBulkDeleteProps => {
    const notify = useNotifier();
    const intl = useIntl();

    const {
        listElements,
        selectedItemsCount,
        reset: resetSelectedItems,
    } = useGiftCardListBulkActions();

    const onCompleted = (data: BulkDeleteGiftCard) => {
        const errors = data?.giftCardBulkDelete?.errors;

        if (!errors.length) {
            notify({
                status: "success",
                text: intl.formatMessage(messages.deleteSuccessAlertText, {
                    selectedItemsCount,
                }),
            });

            onClose();
            resetSelectedItems();
            return;
        }

        notify({
            status: "error",
            text: intl.formatMessage(commonErrorMessages.unknownError),
        });
    };

    const [bulkDeleteGiftCard, bulkDeleteGiftCardOpts] = useGiftCardBulkDeleteMutation({
        onCompleted,
        refetchQueries,
    });

    const onBulkDeleteGiftCards = () => bulkDeleteGiftCard({ variables: { ids: listElements } });

    return {
        onBulkDeleteGiftCards,
        bulkDeleteGiftCardOpts,
    };
};

export default useGiftCardBulkDelete;
