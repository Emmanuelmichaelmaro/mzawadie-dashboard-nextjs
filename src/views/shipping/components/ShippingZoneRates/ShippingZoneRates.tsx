// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button, Card, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CardTitle from "@mzawadie/components/CardTitle";
import IconButtonTableCell from "@mzawadie/components/IconButtonTableCell";
import Money from "@mzawadie/components/Money";
import MoneyRange from "@mzawadie/components/MoneyRange";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import WeightRange from "@mzawadie/components/WeightRange";
import { ChannelProps } from "@mzawadie/core";
import { ShippingZoneDetailsFragment_shippingMethods } from "@mzawadie/fragments/types/ShippingZoneDetailsFragment";
import { makeStyles, ICONBUTTON_SIZE } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../../misc";

export interface ShippingZoneRatesProps extends ChannelProps {
    disabled: boolean;
    rates: ShippingZoneDetailsFragment_shippingMethods[];
    variant: "price" | "weight";
    testId?: string;
    onRateAdd: () => void;
    onRateEdit: (id: string) => void;
    onRateRemove: (id: string) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        alignRight: {
            paddingRight: 24,
            width: `calc(${ICONBUTTON_SIZE}px + ${theme.spacing(0.5)})`,
        },
        buttonColumn: {
            padding: "4px 0",
            width: "62px",
        },
        nameColumn: {
            width: "auto",
        },
        valueColumn: {
            width: "auto",
        },
    }),
    { name: "ShippingZoneRates" }
);
const ShippingZoneRates: React.FC<ShippingZoneRatesProps> = (props) => {
    const { disabled, onRateAdd, onRateEdit, onRateRemove, rates, selectedChannelId, variant, testId } =
        props;

    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                height="const"
                title={
                    variant === "price"
                        ? intl.formatMessage({
                              defaultMessage: "Price Based Rates",
                              id: "FjrExY",
                              description: "price based shipping methods, section header",
                          })
                        : intl.formatMessage({
                              defaultMessage: "Weight Based Rates",
                              id: "foB6wx",
                              description: "weight based shipping methods, section header",
                          })
                }
                toolbar={
                    <Button
                        color="primary"
                        disabled={disabled}
                        onClick={onRateAdd}
                        data-test-id={testId}
                    >
                        <FormattedMessage
                            defaultMessage="Create rate"
                            id="WR8rir"
                            description="button"
                        />
                    </Button>
                }
            />
            <ResponsiveTable>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.nameColumn}>
                            <FormattedMessage
                                defaultMessage="Name"
                                id="aPCrsp"
                                description="shipping method name"
                            />
                        </TableCell>
                        <TableCell className={classes.valueColumn}>
                            {variant === "price"
                                ? intl.formatMessage({
                                      defaultMessage: "Value Range",
                                      id: "njUQPz",
                                      description: "shipping method price range",
                                  })
                                : intl.formatMessage({
                                      defaultMessage: "Weight Range",
                                      id: "aYhcie",
                                      description: "shipping method weight range",
                                  })}
                        </TableCell>
                        <TableCell className={classes.nameColumn}>
                            <FormattedMessage
                                defaultMessage="Price"
                                id="EKoPNg"
                                description="shipping method price"
                            />
                        </TableCell>
                        <TableCell className={classes.buttonColumn} />
                        <TableCell className={classes.buttonColumn} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderCollection(
                        rates,
                        (rate) => {
                            const channel = rate?.channelListings?.find(
                                (listing) => listing.channel.id === selectedChannelId
                            );
                            return (
                                <TableRow
                                    hover={!!rate}
                                    key={rate ? rate.id : "skeleton"}
                                    onClick={rate ? () => onRateEdit(rate.id) : undefined}
                                >
                                    <TableCell className={classes.nameColumn}>
                                        {maybe<React.ReactNode>(() => rate.name, <Skeleton />)}
                                    </TableCell>
                                    <TableCell>
                                        {maybe<React.ReactNode>(
                                            () =>
                                                rate && !channel ? (
                                                    "-"
                                                ) : variant === "price" ? (
                                                    <MoneyRange
                                                        from={channel.minimumOrderPrice}
                                                        to={channel.maximumOrderPrice}
                                                    />
                                                ) : (
                                                    <WeightRange
                                                        from={rate.minimumOrderWeight}
                                                        to={rate.maximumOrderWeight}
                                                    />
                                                ),
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <TableCell data-test-id="shipping-rate-price">
                                        {maybe<React.ReactNode>(
                                            () =>
                                                rate && !channel ? (
                                                    "-"
                                                ) : (
                                                    <Money money={channel.price} />
                                                ),
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                    <IconButtonTableCell
                                        disabled={disabled}
                                        onClick={() => onRateEdit(rate.id)}
                                        className={classes.buttonColumn}
                                    >
                                        <EditIcon />
                                    </IconButtonTableCell>
                                    <IconButtonTableCell
                                        disabled={disabled}
                                        onClick={() => onRateRemove(rate.id)}
                                        className={classes.buttonColumn}
                                    >
                                        <DeleteIcon />
                                    </IconButtonTableCell>
                                </TableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <FormattedMessage
                                        defaultMessage="No shipping rates found"
                                        id="RUzdUH"
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};
ShippingZoneRates.displayName = "ShippingZoneRates";
export default ShippingZoneRates;
