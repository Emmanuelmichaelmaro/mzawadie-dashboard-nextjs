// @ts-nocheck
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Grid } from "@mzawadie/components/Grid";
import Hr from "@mzawadie/components/Hr";
import { commonMessages } from "@mzawadie/core";
import { AccountErrorFragment } from "@mzawadie/graphql";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAccountErrorMessage from "@mzawadie/utils/errors/account";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        content: {
            paddingTop: theme.spacing(2),
        },
        hr: {
            margin: theme.spacing(3, 0),
        },
        sectionHeader: {
            marginBottom: theme.spacing(),
        },
    }),
    { name: "CustomerInfo" }
);

export interface CustomerInfoProps {
    data: {
        firstName: string;
        lastName: string;
        email: string;
    };
    disabled: boolean;
    errors: AccountErrorFragment[];
    onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = (props) => {
    const { data, disabled, errors, onChange } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const formErrors = getFormErrors(["firstName", "lastName", "email"], errors);

    return (
        <Card>
            <CardTitle
                title={
                    <FormattedMessage
                        defaultMessage="Account Information"
                        id="4v5gfh"
                        description="account information, header"
                    />
                }
            />
            <CardContent className={classes.content}>
                <Typography className={classes.sectionHeader}>
                    <FormattedMessage {...commonMessages.generalInformations} />
                </Typography>
                <Grid variant="uniform">
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.firstName}
                        fullWidth
                        helperText={getAccountErrorMessage(formErrors.firstName, intl)}
                        name="firstName"
                        type="text"
                        label={intl.formatMessage(commonMessages.firstName)}
                        value={data.firstName}
                        onChange={onChange}
                    />
                    <TextField
                        disabled={disabled}
                        error={!!formErrors.lastName}
                        fullWidth
                        helperText={getAccountErrorMessage(formErrors.lastName, intl)}
                        name="lastName"
                        type="text"
                        label={intl.formatMessage(commonMessages.lastName)}
                        value={data.lastName}
                        onChange={onChange}
                    />
                </Grid>
                <Hr className={classes.hr} />
                <Typography className={classes.sectionHeader}>
                    <FormattedMessage
                        defaultMessage="Contact Information"
                        id="SMakqb"
                        description="customer contact section, header"
                    />
                </Typography>
                <TextField
                    disabled={disabled}
                    error={!!formErrors.email}
                    fullWidth
                    helperText={getAccountErrorMessage(formErrors.email, intl)}
                    name="email"
                    type="email"
                    label={intl.formatMessage(commonMessages.email)}
                    value={data.email}
                    onChange={onChange}
                />
            </CardContent>
        </Card>
    );
};

CustomerInfo.displayName = "CustomerInfo";

export default CustomerInfo;
