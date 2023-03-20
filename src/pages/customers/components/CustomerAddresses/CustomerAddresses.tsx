// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import { AddressFormatter } from "@mzawadie/components/AddressFormatter";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Hr } from "@mzawadie/components/Hr";
import { buttonMessages, maybe } from "@mzawadie/core";
import { CustomerDetailsFragment } from "@mzawadie/graphql";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        label: {
            fontWeight: 600,
            marginBottom: theme.spacing(1),
        },
    }),
    { name: "CustomerAddresses" }
);

export interface CustomerAddressesProps {
    customer: CustomerDetailsFragment;
    disabled: boolean;
    onAddressManageClick: () => void;
}

const CustomerAddresses: React.FC<CustomerAddressesProps> = (props) => {
    const { customer, disabled, onAddressManageClick } = props;
    const classes = useStyles(props);

    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Address Information",
                    id: "BfJGij",
                    description: "header",
                })}
                toolbar={
                    <Button
                        data-test-id="manage-addresses"
                        disabled={disabled}
                        variant="tertiary"
                        onClick={onAddressManageClick}
                    >
                        <FormattedMessage {...buttonMessages.manage} />
                    </Button>
                }
            />
            {maybe(() => customer.defaultBillingAddress.id) !==
            maybe(() => customer.defaultShippingAddress.id) ? (
                <>
                    {maybe(() => customer.defaultBillingAddress) !== null && (
                        <CardContent>
                            <Typography className={classes.label}>
                                <FormattedMessage
                                    defaultMessage="Billing Address"
                                    id="biVFKU"
                                    description="subsection header"
                                />
                            </Typography>
                            <AddressFormatter address={maybe(() => customer.defaultBillingAddress)} />
                        </CardContent>
                    )}
                    {maybe(() => customer.defaultBillingAddress && customer.defaultShippingAddress) && (
                        <Hr />
                    )}
                    {maybe(() => customer.defaultShippingAddress) && (
                        <CardContent>
                            <Typography className={classes.label}>
                                <FormattedMessage
                                    defaultMessage="Shipping Address"
                                    id="Zd3Eew"
                                    description="subsection header"
                                />
                            </Typography>
                            <AddressFormatter address={maybe(() => customer.defaultShippingAddress)} />
                        </CardContent>
                    )}
                </>
            ) : maybe(() => customer.defaultBillingAddress) === null &&
              maybe(() => customer.defaultShippingAddress) === null ? (
                <CardContent>
                    <Typography>
                        <FormattedMessage
                            defaultMessage="This customer has no addresses yet"
                            id="3d1RXL"
                        />
                    </Typography>
                </CardContent>
            ) : (
                <CardContent>
                    <Typography className={classes.label}>
                        <FormattedMessage
                            defaultMessage="Address"
                            id="bHdFph"
                            description="subsection header"
                        />
                    </Typography>
                    <AddressFormatter address={maybe(() => customer.defaultBillingAddress)} />
                </CardContent>
            )}
        </Card>
    );
};

CustomerAddresses.displayName = "CustomerAddresses";

export default CustomerAddresses;
