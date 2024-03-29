// @ts-nocheck
import { Card, CardActions, Dialog } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { CollectionWithDividers } from "@mzawadie/components/CollectionWithDividers";
import Link from "@mzawadie/components/Link";
import { PreviewPill } from "@mzawadie/components/PreviewPill";
import Skeleton from "@mzawadie/components/Skeleton";
import { getFullName } from "@mzawadie/core";
import { useCustomerGiftCardListQuery } from "@mzawadie/graphql";
import { VerticalSpacer } from "@mzawadie/pages/apps/components/VerticalSpacer";
import { useCustomerDetails } from "@mzawadie/pages/customers/hooks/useCustomerDetails";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { Button } from "@saleor/macaw-ui";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardListUrl } from "../../urls";
import GiftCardCreateDialogContent from "../GiftCardCreateDialog/GiftCardCreateDialogContent";
import { getExtendedGiftCard } from "../GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import CustomerGiftCardsCardListItem from "./CustomerGiftCardsCardListItem";
import { giftCardCustomerCardMessages as messages } from "./messages";
import { CUSTOMER_GIFT_CARD_LIST_QUERY } from "./queries";
import { useCardActionsStyles } from "./styles";

const CustomerGiftCardsCard: React.FC = () => {
    const intl = useIntl();
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const customerDetails = useCustomerDetails();
    const customer = customerDetails?.customer?.user;
    const id = customer?.id;

    const { data, loading } = useCustomerGiftCardListQuery({
        variables: {
            first: 5,
            filter: {
                usedBy: [id],
            },
        },
        skip: !id,
    });

    const closeCreateDialog = () => setOpenCreateDialog(false);

    const giftCards = mapEdgesToItems(data?.giftCards);

    const classes = useCardActionsStyles({
        buttonPosition: giftCards?.length > 0 ? "right" : "left",
    });

    const viewAllGiftCardsUrl = giftCardListUrl({
        usedBy: [id],
    });

    const handleCreateNewCardButton = () => {
        setOpenCreateDialog(true);
    };

    return (
        <>
            <Card>
                <CardTitle
                    title={intl.formatMessage(messages.customerGiftCardsCardTitle)}
                    toolbar={
                        <>
                            {!!giftCards?.length && (
                                <Button variant="tertiary" href={viewAllGiftCardsUrl} component={Link}>
                                    <FormattedMessage {...messages.customerGiftCardsViewAllButton} />
                                </Button>
                            )}
                            <PreviewPill className={classes.previewPill} />
                        </>
                    }
                >
                    <FormattedMessage
                        {...(!!giftCards?.length
                            ? messages.customerGiftCardsPresentSubtitle
                            : messages.customerGiftCardsAbsentSubtitle)}
                    />
                    <VerticalSpacer spacing={2} />
                </CardTitle>

                {!loading && giftCards ? (
                    <CollectionWithDividers
                        collection={giftCards}
                        renderItem={(giftCard) => (
                            <CustomerGiftCardsCardListItem giftCard={getExtendedGiftCard(giftCard)} />
                        )}
                        withOuterDividers
                    />
                ) : (
                    <Skeleton />
                )}
                <CardActions className={classes.cardActions}>
                    <Button variant="tertiary" onClick={handleCreateNewCardButton}>
                        <FormattedMessage {...messages.customerGiftCardsIssueNewCardButton} />
                    </Button>
                </CardActions>
            </Card>

            <Dialog open={openCreateDialog} maxWidth="sm" onClose={closeCreateDialog}>
                <GiftCardCreateDialogContent
                    onClose={closeCreateDialog}
                    refetchQueries={[CUSTOMER_GIFT_CARD_LIST_QUERY]}
                    initialCustomer={{
                        email: customer?.email,
                        name: getFullName(customer),
                    }}
                />
            </Dialog>
        </>
    );
};

export default CustomerGiftCardsCard;
