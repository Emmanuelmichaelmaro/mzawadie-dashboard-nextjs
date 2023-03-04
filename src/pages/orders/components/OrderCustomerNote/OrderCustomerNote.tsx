import { Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Skeleton from "@mzawadie/components/Skeleton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderCustomerNoteProps {
    note: string;
}

export const OrderCustomerNote: React.FC<OrderCustomerNoteProps> = ({ note }) => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Notes",
                    id: "puALFo",
                    description: "notes about customer, header",
                })}
            />
            <CardContent>
                {note === undefined ? (
                    <Skeleton />
                ) : note === "" ? (
                    <Typography color="textSecondary">
                        <FormattedMessage defaultMessage="No notes from customer" id="VrFy8e" />
                    </Typography>
                ) : (
                    <Typography>{note}</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderCustomerNote;
