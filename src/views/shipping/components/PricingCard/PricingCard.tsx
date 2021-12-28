// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Card, CardContent, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import PriceField from "@mzawadie/components/PriceField";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import TableHead from "@mzawadie/components/TableHead";
import { ShippingChannelsErrorFragment } from "@mzawadie/fragments/types/ShippingChannelsErrorFragment";
import { getFormChannelError, getFormChannelErrors } from "@mzawadie/utils/errors";
import getShippingErrorMessage from "@mzawadie/utils/errors/shipping";
import { ChannelShippingData } from "@mzawadie/views/channels/utils";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface Value {
    maxValue: string;
    minValue: string;
    price: string;
}

export interface PricingCardProps {
    channels: ChannelShippingData[];
    errors: ShippingChannelsErrorFragment[];
    disabled: boolean;
    onChange: (channelId: string, value: Value) => void;
}

const numberOfColumns = 2;

export const PricingCard: React.FC<PricingCardProps> = ({ channels, disabled, errors, onChange }) => {
    const classes = useStyles({});
    const intl = useIntl();
    const formErrors = getFormChannelErrors(["price"], errors);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Pricing",
                    id: "TnTi/a",
                    description: "pricing card title",
                })}
            />
            <CardContent className={classes.pricingContent}>
                <Typography variant="caption" className={classes.caption}>
                    {intl.formatMessage({
                        defaultMessage:
                            "Channels that don’t have assigned prices will use their parent channel to define the price. Price will be converted to channel’s currency",
                        id: "VvA7ai",
                        description: "info text",
                    })}
                </Typography>
                <ResponsiveTable className={classes.table}>
                    <TableHead colSpan={numberOfColumns} disabled={disabled} items={[]}>
                        <TableCell className={classes.colName}>
                            <span>
                                <FormattedMessage
                                    defaultMessage="Channel name"
                                    id="Hj3T7P"
                                    description="column title"
                                />
                            </span>
                        </TableCell>
                        <TableCell className={classes.colType}>
                            <span>
                                <FormattedMessage
                                    defaultMessage="Price"
                                    id="1shOIS"
                                    description="column title"
                                />
                            </span>
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {channels?.map((channel) => {
                            const error = getFormChannelError(formErrors.price, channel.id);

                            return (
                                <TableRow key={channel.id}>
                                    <TableCell>
                                        <Typography>{channel.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <PriceField
                                            disabled={disabled}
                                            error={!!error}
                                            label={intl.formatMessage({
                                                defaultMessage: "Price",
                                                id: "1shOIS",
                                                description: "column title",
                                            })}
                                            name="price"
                                            value={channel.price}
                                            onChange={(e) =>
                                                onChange(channel.id, {
                                                    ...channel,
                                                    price: e.target.value,
                                                })
                                            }
                                            currencySymbol={channel.currency}
                                            required
                                            hint={error && getShippingErrorMessage(error, intl)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </ResponsiveTable>
            </CardContent>
        </Card>
    );
};

export default PricingCard;
