import { Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import CardTitle from "@mzawadie/components/CardTitle";
import Date from "@mzawadie/components/Date";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import Money from "@mzawadie/components/Money";
import Percent from "@mzawadie/components/Percent";
import Skeleton from "@mzawadie/components/Skeleton";
import { commonMessages, maybe, ChannelProps } from "@mzawadie/core";
import { SaleType } from "@mzawadie/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleDetails_sale } from "../../types/SaleDetails";

export interface SaleSummaryProps extends ChannelProps {
    sale: SaleDetails_sale;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({ selectedChannelId, sale }) => {
    const intl = useIntl();

    const channel = sale?.channelListings?.find((listing) => listing.channel.id === selectedChannelId);
    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.summary)} />
            <CardContent>
                <Typography variant="caption">
                    <FormattedMessage defaultMessage="Name" id="F56hOz" description="sale name" />
                </Typography>
                <Typography>{maybe<React.ReactNode>(() => sale.name, <Skeleton />)}</Typography>
                <FormSpacer />

                <Typography variant="caption">
                    <FormattedMessage defaultMessage="Value" id="XZR590" description="sale value" />
                </Typography>
                <Typography>
                    {sale ? (
                        sale.type === SaleType.FIXED && channel?.discountValue ? (
                            <Money
                                money={{
                                    amount: channel?.discountValue,
                                    currency: channel?.currency,
                                }}
                            />
                        ) : channel?.discountValue ? (
                            <Percent amount={channel?.discountValue} />
                        ) : (
                            "-"
                        )
                    ) : (
                        <Skeleton />
                    )}
                </Typography>

                <CardSpacer />
                <Hr />
                <CardSpacer />

                <Typography variant="caption">
                    <FormattedMessage {...commonMessages.startDate} />
                </Typography>
                <Typography>
                    {maybe<React.ReactNode>(
                        () => (
                            <Date date={sale.startDate} plain />
                        ),
                        <Skeleton />
                    )}
                </Typography>
                <FormSpacer />

                <Typography variant="caption">
                    <FormattedMessage {...commonMessages.endDate} />
                </Typography>
                <Typography>
                    {maybe<React.ReactNode>(
                        () => (sale.endDate === null ? "-" : <Date date={sale.endDate} plain />),
                        <Skeleton />
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};

SaleSummary.displayName = "SaleSummary";

export default SaleSummary;
