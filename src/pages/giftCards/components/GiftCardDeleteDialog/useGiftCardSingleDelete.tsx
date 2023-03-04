// @ts-nocheck
import { MutationResultWithOpts } from "@mzawadie/hooks/graphql/makeMutation";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useIntl } from "react-intl";

import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import { useGiftCardDeleteMutation } from "../GiftCardsList/mutations";
import {
    DeleteGiftCard,
    DeleteGiftCard_giftCardDelete_errors,
} from "../GiftCardsList/types/DeleteGiftCard";
import { giftCardDeleteDialogMessages as messages } from "./messages";

interface UseGiftCardSingleDeleteProps {
    onDeleteGiftCard: () => void;
    deleteGiftCardOpts: MutationResultWithOpts<DeleteGiftCard>;
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

    const onCompleted = (data: DeleteGiftCard) => {
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

        errors.map((error: DeleteGiftCard_giftCardDelete_errors) =>
            notify({
                status: "error",
                text: getGiftCardErrorMessage(error, intl),
            })
        );
    };

    const [deleteGiftCard, deleteGiftCardOpts] = useGiftCardDeleteMutation({
        onCompleted,
        refetchQueries,
    });

    const onDeleteGiftCard = () => deleteGiftCard({ variables: { id } });

    return {
        onDeleteGiftCard,
        deleteGiftCardOpts,
    };
};

export default useGiftCardSingleDelete;
