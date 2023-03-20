// @ts-nocheck
import { DeleteGiftCardMutation, useDeleteGiftCardMutation } from "@mzawadie/graphql";
import { MutationResultWithOpts } from "@mzawadie/hooks/makeMutation";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useIntl } from "react-intl";

import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import { giftCardDeleteDialogMessages as messages } from "./messages";

interface UseGiftCardSingleDeleteProps {
    onDeleteGiftCard: () => void;
    deleteGiftCardOpts: MutationResultWithOpts<DeleteGiftCardMutation>;
}

const useGiftCardSingleDelete = ({
    id,
    onClose,
    refetchQueries,
    onSuccess,
}: {
    id: string;
    onClose: () => void;
    onSuccess?: () => void;
    refetchQueries?: string[];
}): UseGiftCardSingleDeleteProps => {
    const notify = useNotifier();
    const intl = useIntl();

    const [deleteGiftCard, deleteGiftCardOpts] = useDeleteGiftCardMutation({
        onCompleted: (data: DeleteGiftCardMutation) => {
            const errors = data?.giftCardDelete?.errors;

            if (!errors.length) {
                notify({
                    status: "success",
                    text: intl.formatMessage(messages.deleteSuccessAlertText, {
                        selectedItemsCount: 1,
                    }),
                });

                onClose();

                if (onSuccess) {
                    onSuccess();
                }

                return;
            }

            errors.map((error) =>
                notify({
                    status: "error",
                    text: getGiftCardErrorMessage(error, intl),
                })
            );
        },
        refetchQueries,
    });

    const onDeleteGiftCard = () => deleteGiftCard({ variables: { id } });

    return {
        onDeleteGiftCard,
        deleteGiftCardOpts,
    };
};

export default useGiftCardSingleDelete;
