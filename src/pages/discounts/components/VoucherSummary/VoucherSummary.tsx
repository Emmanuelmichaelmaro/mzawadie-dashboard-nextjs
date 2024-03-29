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
import { commonMessages, ChannelProps, maybe } from "@mzawadie/core";
import { DiscountValueTypeEnum, VoucherDetailsFragment } from "@mzawadie/graphql";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { translateVoucherTypes } from "../../translations";
import useStyles from "./styles";

export interface VoucherSummaryProps extends ChannelProps {
    voucher: VoucherDetailsFragment;
}

const VoucherSummary: React.FC<VoucherSummaryProps> = ({ selectedChannelId, voucher }) => {
    const intl = useIntl();
    const classes = useStyles();

    const translatedVoucherTypes = translateVoucherTypes(intl);
    const channel = voucher?.channelListings?.find(
        (listing) => listing.channel.id === selectedChannelId
    );

    return (
        <Card>
            <CardTitle title={intl.formatMessage(commonMessages.summary)} />
            <CardContent>
                <Typography variant="caption">
                    <FormattedMessage defaultMessage="Code" id="JsPIOX" description="voucher code" />
                </Typography>

                <Typography className={classes.ellipsis}>
                    {maybe<React.ReactNode>(() => voucher.code, <Skeleton />)}
                </Typography>

                <FormSpacer />

                <Typography variant="caption">
                    <FormattedMessage defaultMessage="Applies to" id="bcf60I" description="voucher" />
                </Typography>

                <Typography>
                    {maybe<React.ReactNode>(() => translatedVoucherTypes[voucher.type], <Skeleton />)}
                </Typography>

                <FormSpacer />

                <Typography variant="caption">
                    <FormattedMessage defaultMessage="Value" id="JV+EiM" description="voucher value" />
                </Typography>

                <Typography>
                    {voucher ? (
                        voucher.discountValueType === DiscountValueTypeEnum.FIXED &&
                        channel?.discountValue ? (
                            <Money
                                money={{
                                    amount: channel?.discountValue,
                                    currency: channel?.channel.currencyCode,
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
                    {intl.formatMessage(commonMessages.startDate)}
                </Typography>

                <Typography>
                    {maybe<React.ReactNode>(
                        () => (
                            <Date date={voucher.startDate} plain />
                        ),
                        <Skeleton />
                    )}
                </Typography>

                <FormSpacer />

                <Typography variant="caption">{intl.formatMessage(commonMessages.endDate)}</Typography>

                <Typography>
                    {maybe<React.ReactNode>(
                        () => (voucher.endDate === null ? "-" : <Date date={voucher.endDate} plain />),
                        <Skeleton />
                    )}
                </Typography>

                <CardSpacer />
                <Hr />
                <CardSpacer />

                <Typography variant="caption">
                    <FormattedMessage
                        defaultMessage="Min. Order Value"
                        id="FOa+Xd"
                        description="voucher value requirement"
                    />
                </Typography>

                <Typography>
                    {voucher ? (
                        channel?.minSpent ? (
                            <Money money={channel.minSpent} />
                        ) : (
                            "-"
                        )
                    ) : (
                        <Skeleton />
                    )}
                </Typography>

                <FormSpacer />

                <Typography variant="caption">
                    <FormattedMessage
                        defaultMessage="Usage Limit"
                        id="HLqWXA"
                        description="voucher value requirement"
                    />
                </Typography>

                <Typography>
                    {maybe<React.ReactNode>(
                        () => (voucher.usageLimit === null ? "-" : voucher.usageLimit),
                        <Skeleton />
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};

VoucherSummary.displayName = "VoucherSummary";

export default VoucherSummary;
