// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Date } from "@mzawadie/components/Date";
import FormSpacer from "@mzawadie/components/FormSpacer";
import Hr from "@mzawadie/components/Hr";
import { Money } from "@mzawadie/components/Money";
import { Percent } from "@mzawadie/components/Percent";
import Skeleton from "@mzawadie/components/Skeleton";
import { commonMessages } from "@mzawadie/core";
import { ChannelProps } from "@mzawadie/core";
import { maybe } from "@mzawadie/core";
import { SaleDetailsFragment, SaleType } from "@mzawadie/graphql";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import useStyles from "./styles";

export interface SaleSummaryProps extends ChannelProps {
    sale: SaleDetailsFragment;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({ selectedChannelId, sale }) => {
    const classes = useStyles();

    const intl = useIntl();

    const channel = sale?.channelListings?.find((listing) => listing.channel.id === selectedChannelId);

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.summary)} />
            <CardContent>
                <Typography variant="caption">
                    <FormattedMessage id="F56hOz" defaultMessage="Name" description="sale name" />
                </Typography>

                <Typography className={classes.ellipsis}>
                    {maybe<React.ReactNode>(() => sale.name, <Skeleton />)}
                </Typography>

                <FormSpacer />

                <Typography variant="caption">
                    <FormattedMessage id="XZR590" defaultMessage="Value" description="sale value" />
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
