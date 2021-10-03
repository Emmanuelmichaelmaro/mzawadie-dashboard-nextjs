/* eslint-disable react/prop-types */
import React from "react";

import { useStyles } from "./styles";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Container = ({ children }) => {
    const classes = useStyles({});
    return !!children.length && <div className={classes.container}>{children}</div>;
};

export default Container;
