import React from "react"

import { useStyles } from "./styles"

const Container = ({ children }) => {
    const classes = useStyles({})
    return children.length > 0 && <div className={classes.container}>{children}</div>
}

export default Container
