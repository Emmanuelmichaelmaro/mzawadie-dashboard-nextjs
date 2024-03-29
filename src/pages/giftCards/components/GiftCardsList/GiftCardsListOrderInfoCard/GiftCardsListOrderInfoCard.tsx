import { Typography } from "@material-ui/core";
import Link from "@mzawadie/components/Link";
import { orderGiftCardBoughtPath } from "@mzawadie/pages/orders/urls";
import { Alert } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardListOrderCardMessages as messages } from "./messages";

const GiftCardsListOrderInfoCard: React.FC = () => (
    <Alert variant="info" close={false}>
        <Typography>
            <FormattedMessage
                {...messages.giftCardOrderInfoMessage}
                values={{
                    link: (content: any) => <Link href={orderGiftCardBoughtPath()}>{content}</Link>,
                }}
            />
        </Typography>
    </Alert>
);

export default GiftCardsListOrderInfoCard;
