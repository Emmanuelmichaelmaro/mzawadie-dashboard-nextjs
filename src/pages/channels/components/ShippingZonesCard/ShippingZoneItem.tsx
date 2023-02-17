import { Divider, Typography } from "@material-ui/core";
import { DeletableItem } from "@mzawadie/components/DeletableItem";
import React from "react";

import { ChannelShippingZone } from "../ChannelDetailsPage/types";
import useStyles from "./styles";

interface ShippingZoneItemProps {
    zone: ChannelShippingZone;
    onDelete: (id: string) => void;
}

const ShippingZoneItem: React.FC<ShippingZoneItemProps> = ({ zone, onDelete }) => {
    const { id, name } = zone;
    const classes = useStyles({});

    return (
        <>
            <div className={classes.container}>
                <Typography>{name}</Typography>
                <DeletableItem id={id} onDelete={onDelete} />
            </div>

            <Divider />
        </>
    );
};

export default ShippingZoneItem;
