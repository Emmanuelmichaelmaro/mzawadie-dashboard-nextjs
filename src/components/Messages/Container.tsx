import React from "react";

// @ts-ignore
import { useStyles } from "./styles";

const Container = ({ children }: any) => {
    const classes = useStyles({});
    return !!children.length && <div className={classes.container}>{children}</div>;
};

export default Container;
