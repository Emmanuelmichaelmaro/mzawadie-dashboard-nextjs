// @ts-nocheck
import {
    Card,
    CardContent,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { renderCollection } from "@mzawadie/core";
import { DiscountErrorFragment } from "@mzawadie/graphql";
import { getFormErrors } from "@mzawadie/utils/errors";
import getDiscountErrorMessage from "@mzawadie/utils/errors/discounts";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";
import SaleValueTextField from "./SaleValueTextField";
import { useStyles } from "./styles";
import { SaleValueInputOnChangeType } from "./types";

export interface SaleValueProps {
    data: SaleDetailsPageFormData;
    disabled: boolean;
    errors: DiscountErrorFragment[];
    onChange: SaleValueInputOnChangeType;
}

const numberOfColumns = 2;

const SaleValue: React.FC<SaleValueProps> = ({ data, disabled, errors, onChange }) => {
    const { type } = data;
    const intl = useIntl();
    const classes = useStyles({});
    const formErrors = getFormErrors(["value"], errors);

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Value",
                    id: "wHdMAX",
                    description: "sale value, header",
                })}
            />
            <CardContent className={classes.card}>
                <Typography variant="caption" className={classes.info}>
                    <FormattedMessage
                        defaultMessage="Channels that don’t have assigned discounts will use their parent channel to define the price. Price will be converted to channel’s currency"
                        id="cehiWu"
                        description="channels sale info"
                    />
                </Typography>
            </CardContent>
            <ResponsiveTable className={classes.table}>
                <colgroup>
                    <col />
                    <col className={classes.colValue} />
                </colgroup>
                <TableHead>
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
                                defaultMessage="Value"
                                id="wHdMAX"
                                description="sale value, header"
                            />
                        </span>
                    </TableCell>
                </TableHead>
                <TableBody>
                    {renderCollection(
                        data.channelListings,
                        (listing, index) => {
                            const error = formErrors.value?.channels?.find((id) => id === listing.id);
                            return (
                                <TableRow
                                    key={listing?.id || `skeleton-${index}`}
                                    className={classes.row}
                                >
                                    <TableCell>
                                        <Typography>{listing?.name || <Skeleton />}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        {listing ? (
                                            <SaleValueTextField
                                                dataType={type}
                                                helperText={
                                                    error
                                                        ? getDiscountErrorMessage(
                                                              formErrors.value,
                                                              intl
                                                          )
                                                        : ""
                                                }
                                                disabled={disabled}
                                                listing={listing}
                                                onChange={onChange}
                                            />
                                        ) : (
                                            <Skeleton />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage defaultMessage="No channels found" id="/glQgs" />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

SaleValue.displayName = "SaleValue";

export default SaleValue;
