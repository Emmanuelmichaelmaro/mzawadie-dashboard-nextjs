/* eslint-disable react/prop-types */
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import HorizontalSpacer from "../../views/apps/components/HorizontalSpacer";
import StatusChip from "../StatusChip";
import { StatusType } from "../StatusChip/types";

export interface PageTitleWithStatusChipProps {
    title: string;
    statusLabel: string;
    statusType: StatusType;
}

const useStyles = makeStyles(
    () => ({
        container: {
            alignItems: "center",
            display: "flex",
        },
    }),
    { name: "OrderDetailsPageTitleWithStatusChip" }
);

const PageTitleWithStatusChip: React.FC<PageTitleWithStatusChipProps> = ({
    title,
    statusLabel,
    statusType,
}) => {
    const classes = useStyles({});

    return (
        <div className={classes.container}>
            {title}
            <HorizontalSpacer spacing={2} />
            <StatusChip label={statusLabel} status={statusType} />
        </div>
    );
};

export default PageTitleWithStatusChip;
