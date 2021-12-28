// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

export interface HorizontalSpacerProps {
    spacing?: number | undefined;
}

const useStyles = makeStyles(
    (theme) => ({
        container: ({ spacing }: HorizontalSpacerProps) => ({
            width: theme.spacing(spacing),
        }),
    }),
    { name: "HorizontalSpacer" }
);

const HorizontalSpacer: React.FC<HorizontalSpacerProps> = ({ spacing = 1 }) => {
    const classes = useStyles({ spacing });

    return <div className={classes.container} />;
};

export default HorizontalSpacer;
