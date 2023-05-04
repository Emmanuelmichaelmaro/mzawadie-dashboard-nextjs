// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Link from "@mzawadie/components/Link";
import Skeleton from "@mzawadie/components/Skeleton";
import { ChannelFragment } from "@mzawadie/graphql";
import { channelUrl } from "@mzawadie/pages/channels/urls";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderChannelSectionCardProps {
    channel?: Pick<ChannelFragment, "id" | "name">;
}

export const OrderChannelSectionCard: React.FC<OrderChannelSectionCardProps> = ({ channel }) => {
    const intl = useIntl();

    return (
        <Card data-test-id="order-sales-channel">
            <CardTitle
                title={intl.formatMessage({
                    id: "aY0HAT",
                    defaultMessage: "Sales channel",
                    description: "section header",
                })}
            />

            <CardContent>
                {!channel ? (
                    <Skeleton />
                ) : (
                    <Typography>
                        <Link href={channelUrl(channel.id) ?? ""} disabled={!channel.id}>
                            {channel.name ?? "..."}
                        </Link>
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

OrderChannelSectionCard.displayName = "OrderChannelSectionCard";

export default OrderChannelSectionCard;
