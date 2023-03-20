// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Link from "@mzawadie/components/Link";
import Skeleton from "@mzawadie/components/Skeleton";
import { maybe, RelayToFlat, renderCollection } from "@mzawadie/core";
import { WarehouseWithShippingFragment } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface WarehouseInfoProps {
    zones: RelayToFlat<WarehouseWithShippingFragment["shippingZones"]>;
    onShippingZoneClick: (id: string) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        link: {
            "&:not(:last-of-type)": {
                marginBottom: theme.spacing(),
            },
        },
    }),
    {
        name: "WarehouseInfoProps",
    }
);

const WarehouseInfo: React.FC<WarehouseInfoProps> = ({ zones, onShippingZoneClick }) => {
    const classes = useStyles({});
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Shipping Zones",
                    id: "fkJH/L",
                    description: "zones that warehouse sends to",
                })}
            />

            <CardContent>
                {renderCollection(
                    zones,
                    (zone) =>
                        maybe(
                            () => (
                                <div className={classes.link} key={zone?.id}>
                                    <Link underline onClick={() => onShippingZoneClick(zone?.id)}>
                                        {zone?.name}
                                    </Link>
                                </div>
                            ),
                            <Skeleton />
                        ),
                    () => (
                        <Typography color="textSecondary">
                            <FormattedMessage
                                defaultMessage="This warehouse has no shipping zones assigned."
                                id="0FIgpN"
                            />
                        </Typography>
                    )
                )}
            </CardContent>
        </Card>
    );
};

WarehouseInfo.displayName = "WarehouseInfo";

export default WarehouseInfo;
