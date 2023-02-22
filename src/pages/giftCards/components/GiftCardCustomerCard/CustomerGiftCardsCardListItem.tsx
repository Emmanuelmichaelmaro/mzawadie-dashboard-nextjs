// @ts-nocheck
import { CardMenu, CardMenuItem } from "@mzawadie/components/CardMenu";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardDeleteDialogContent from "../GiftCardDeleteDialog/GiftCardDeleteDialogContent";
import useGiftCardSingleDelete from "../GiftCardDeleteDialog/useGiftCardSingleDelete";
import useGiftCardActivateToggle from "../GiftCardUpdate/GiftCardUpdatePageHeader/hooks/useGiftCardActivateToggle";
import { ExtendedGiftCard } from "../GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { bulkEnableDisableSectionMessages } from "../GiftCardsList/GiftCardsListTable/GiftCardsListTableHeader/messages";
import { giftCardsListTableMessages } from "../GiftCardsList/messages";
import { CUSTOMER_GIFT_CARD_LIST_QUERY } from "./queries";
import { useListWrapperStyles } from "./styles";
import { CustomerGiftCardList_giftCards_edges_node } from "./types/CustomerGiftCardList";

interface CustomerGiftCardsCardListItemProps {
    giftCard: ExtendedGiftCard<CustomerGiftCardList_giftCards_edges_node>;
}

const CustomerGiftCardsCardListItem: React.FC<CustomerGiftCardsCardListItemProps> = ({ giftCard }) => {
    const intl = useIntl();
    const classes = useListWrapperStyles();
    const [openDeleteGiftCard, setOpenDeleteGiftCard] = useState(false);
    const { isExpired, isActive, last4CodeChars } = giftCard;

    const onGiftCardDeleteDialogClose = () => setOpenDeleteGiftCard(false);

    const { giftCardActivate, giftCardDeactivate, giftCardActivateOpts, giftCardDeactivateOpts } =
        useGiftCardActivateToggle({
            isActive,
        });

    const handleGiftCardActivate = () => {
        giftCardActivate({
            variables: {
                id: giftCard.id,
            },
        });
    };

    const handleGiftCardDeactivate = () => {
        giftCardDeactivate({
            variables: {
                id: giftCard.id,
            },
        });
    };

    const handleGiftCardDelete = () => setOpenDeleteGiftCard(true);

    const getMenuItems = (): CardMenuItem[] => {
        const items = [
            {
                label: intl.formatMessage(bulkEnableDisableSectionMessages.deleteLabel),
                onSelect: handleGiftCardDelete,
            },
        ];

        if (isExpired) {
            return items;
        }

        const statusButton = isActive
            ? {
                  label: intl.formatMessage(bulkEnableDisableSectionMessages.disableLabel),
                  onSelect: handleGiftCardDeactivate,
                  loading: giftCardDeactivateOpts.loading,
                  withLoading: true,
                  hasError: !!giftCardDeactivateOpts.error,
              }
            : {
                  label: intl.formatMessage(bulkEnableDisableSectionMessages.enableLabel),
                  onSelect: handleGiftCardActivate,
                  loading: giftCardActivateOpts.loading,
                  withLoading: true,
                  hasError: !!giftCardActivateOpts.error,
              };

        return [...items, statusButton];
    };

    const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
        id: giftCard?.id,
        onClose: onGiftCardDeleteDialogClose,
        refetchQueries: [CUSTOMER_GIFT_CARD_LIST_QUERY],
    });

    return (
        <>
            <div className={classes.listingWrapper}>
                <FormattedMessage
                    values={{
                        last4CodeChars,
                    }}
                    {...giftCardsListTableMessages.codeEndingWithLabel}
                />
                <GiftCardStatusChip giftCard={giftCard} />
                <CardMenu className={classes.listingMenu} menuItems={getMenuItems()} />
            </div>
            <GiftCardDeleteDialogContent
                singleDeletion
                giftCard={giftCard}
                open={openDeleteGiftCard}
                onClose={onGiftCardDeleteDialogClose}
                onConfirm={onDeleteGiftCard}
                confirmButtonState={deleteGiftCardOpts?.status}
            />
        </>
    );
};

export default CustomerGiftCardsCardListItem;
