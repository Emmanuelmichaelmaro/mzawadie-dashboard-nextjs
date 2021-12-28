import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import { ControlledCheckbox } from "@mzawadie/components/ControlledCheckbox";
import Skeleton from "@mzawadie/components/Skeleton";
import { maybe } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAccountErrorMessage from "@mzawadie/utils/errors/account";
import { makeStyles } from "@saleor/macaw-ui";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerDetails_user } from "../../types/CustomerDetails";

const useStyles = makeStyles(
    (theme) => ({
        cardTitle: {
            height: 72,
        },
        checkbox: {
            marginBottom: theme.spacing(),
        },
        content: {
            paddingTop: theme.spacing(),
        },
        subtitle: {
            marginTop: theme.spacing(),
        },
    }),
    { name: "CustomerDetails" }
);

export interface CustomerDetailsProps {
    customer: CustomerDetails_user;
    data: {
        isActive: boolean;
        note: string;
    };
    disabled: boolean;
    errors: AccountErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = (props) => {
    const { customer, data, disabled, errors, onChange } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const formErrors = getFormErrors(["note"], errors);

    return (
        <Card>
            <CardTitle
                className={classes.cardTitle}
                title={
                    <>
                        {maybe<React.ReactNode>(() => customer.email, <Skeleton />)}
                        {customer && customer.dateJoined ? (
                            <Typography className={classes.subtitle} variant="caption" component="div">
                                <FormattedMessage
                                    defaultMessage="Active member since {date}"
                                    id="MjUyhA"
                                    description="section subheader"
                                    values={{
                                        date: moment(customer.dateJoined).format("MMM YYYY"),
                                    }}
                                />
                            </Typography>
                        ) : (
                            <Skeleton style={{ width: "10rem" }} />
                        )}
                    </>
                }
            />
            <CardContent className={classes.content}>
                <ControlledCheckbox
                    checked={data.isActive}
                    className={classes.checkbox}
                    disabled={disabled}
                    label={intl.formatMessage({
                        defaultMessage: "User account active",
                        id: "+NUzaQ",
                        description: "check to mark this account as active",
                    })}
                    name="isActive"
                    onChange={onChange}
                />
                <TextField
                    disabled={disabled}
                    error={!!formErrors.note}
                    fullWidth
                    multiline
                    helperText={getAccountErrorMessage(formErrors.note, intl)}
                    name="note"
                    label={intl.formatMessage({
                        defaultMessage: "Note",
                        id: "uUQ+Al",
                        description: "note about customer",
                    })}
                    value={data.note}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};
CustomerDetails.displayName = "CustomerDetails";
export default CustomerDetails;
