import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import { DateTime } from "@mzawadie/components/Date";
import { Hr } from "@mzawadie/components/Hr";
import Skeleton from "@mzawadie/components/Skeleton";
import { maybe } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerDetails_user } from "../../types/CustomerDetails";

const useStyles = makeStyles(
    (theme) => ({
        label: {
            marginBottom: theme.spacing(1),
        },
        value: {
            fontSize: 24,
        },
    }),
    { name: "CustomerStats" }
);

export interface CustomerStatsProps {
    customer: CustomerDetails_user;
}

const CustomerStats: React.FC<CustomerStatsProps> = (props) => {
    const { customer } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Customer History",
                    id: "e7Nyu7",
                    description: "section header",
                })}
            />
            <CardContent>
                <Typography className={classes.label} variant="caption">
                    <FormattedMessage defaultMessage="Last login" id="FNAZoh" />
                </Typography>
                {maybe(
                    () => (
                        <Typography variant="h6" className={classes.value}>
                            {customer.lastLogin === null ? "-" : <DateTime date={customer.lastLogin} />}
                        </Typography>
                    ),
                    <Skeleton />
                )}
            </CardContent>
            <Hr />
            <CardContent>
                <Typography className={classes.label} variant="caption">
                    <FormattedMessage defaultMessage="Last order" id="HMD+ib" />
                </Typography>
                {maybe(
                    () => (
                        <Typography variant="h6" className={classes.value}>
                            {customer.lastPlacedOrder?.edges.length === 0 ? (
                                "-"
                            ) : (
                                <DateTime date={customer.lastPlacedOrder?.edges[0].node.created} />
                            )}
                        </Typography>
                    ),
                    <Skeleton />
                )}
            </CardContent>
        </Card>
    );
};
CustomerStats.displayName = "CustomerStats";
export default CustomerStats;
