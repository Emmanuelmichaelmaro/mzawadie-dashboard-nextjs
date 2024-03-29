import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Skeleton from "@mzawadie/components/Skeleton";
import { VerticalSpacer } from "@mzawadie/pages/apps/components/VerticalSpacer";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { GiftCardTagInput } from "../../GiftCardTagInput";
import { GiftCardUpdateExpirySelect } from "../GiftCardUpdateExpirySelect";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import useGiftCardUpdateForm from "../providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import GiftCardUpdateDetailsBalanceSection from "./GiftCardUpdateDetailsBalanceSection";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

const GiftCardUpdateDetailsCard: React.FC = () => {
    const intl = useIntl();

    const { loading, giftCard } = useGiftCardDetails();
    const { openSetBalanceDialog } = useGiftCardUpdateDialogs();
    const {
        toggleValue,
        data: { tags },
        formErrors,
    } = useGiftCardUpdateForm();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage(messages.title)}
                toolbar={
                    !loading &&
                    !giftCard?.isExpired && (
                        <Button data-test-id="set-balance-button" onClick={openSetBalanceDialog}>
                            {intl.formatMessage(messages.setBalanceButtonLabel)}
                        </Button>
                    )
                }
            />
            <CardContent>
                {loading ? (
                    <Skeleton />
                ) : (
                    <>
                        <GiftCardUpdateDetailsBalanceSection />
                        <CardSpacer />
                        <Divider />
                        <CardSpacer />
                        <Typography color="textSecondary">
                            {intl.formatMessage(messages.tagInputLabel)}
                        </Typography>
                        <VerticalSpacer />
                        <GiftCardTagInput
                            error={formErrors?.tags}
                            name="tags"
                            values={tags}
                            toggleChange={toggleValue}
                        />
                        <CardSpacer />
                        <GiftCardUpdateExpirySelect />
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default GiftCardUpdateDetailsCard;
