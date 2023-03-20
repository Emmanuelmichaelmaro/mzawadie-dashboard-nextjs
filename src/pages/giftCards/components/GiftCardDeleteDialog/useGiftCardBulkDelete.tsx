// @ts-nocheck
import { BulkDeleteGiftCardMutation, useBulkDeleteGiftCardMutation } from "@mzawadie/graphql";
import { MutationResultWithOpts } from "@mzawadie/hooks/makeMutation";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import commonErrorMessages from "@mzawadie/utils/errors/common";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";
import { useGiftCardList } from "@mzawadie/pages/giftCards/components/GiftCardsList/providers/GiftCardListProvider";

interface UseGiftCardBulkDeleteProps {
    onBulkDeleteGiftCards: () => void;
    bulkDeleteGiftCardOpts: MutationResultWithOpts<BulkDeleteGiftCardMutation>;
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
    } = useGiftCardList();

    const [bulkDeleteGiftCard, bulkDeleteGiftCardOpts] = useBulkDeleteGiftCardMutation({
        onCompleted: (data: BulkDeleteGiftCardMutation) => {
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
        },
        refetchQueries,
    });

    const onBulkDeleteGiftCards = () => bulkDeleteGiftCard({ variables: { ids: listElements } });

    return {
        onBulkDeleteGiftCards,
        bulkDeleteGiftCardOpts,
    };
};

export default useGiftCardBulkDelete;
