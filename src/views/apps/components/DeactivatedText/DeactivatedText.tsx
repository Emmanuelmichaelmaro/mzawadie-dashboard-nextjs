import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export const DeactivatedText: React.FC<{}> = () => {
    const classes = useStyles({});
    return (
        <Typography className={classes.root}>
            <FormattedMessage defaultMessage="Deactivated" id="5+Xcrz" description="app deactivated" />
        </Typography>
    );
};

export default DeactivatedText;
