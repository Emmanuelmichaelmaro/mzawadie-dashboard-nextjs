import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
    title: {
        defaultMessage: "Availability",
        id: "CT5PAn",
        description: "CannotDefineChannelsAvailabilityCard title",
    },
    subtitle: {
        defaultMessage: "You will be able to define availability of product after creating variants.",
        id: "8qL/tV",
        description: "CannotDefineChannelsAvailabilityCard subtitle",
    },
});

const CannotDefineChannelsAvailabilityCard: React.FC = () => (
    <Card>
        <CardTitle title={<FormattedMessage {...messages.title} />} />
        <CardContent>
            <FormattedMessage {...messages.subtitle} />
        </CardContent>
    </Card>
);

export default CannotDefineChannelsAvailabilityCard;
