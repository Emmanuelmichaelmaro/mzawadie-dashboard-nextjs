import { Fade, Modal } from "@material-ui/core"
import { makeStyles, useTheme } from "@saleor/macaw-ui"
import React from "react"

const useStyles = makeStyles(
    (theme) => ({
        modal: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            padding: theme.spacing(3),
        },
        paper: {
            overflow: "hidden",
        },
        root: {
            [theme.breakpoints.down("sm")]: {
                height: "auto",
            },
            height: 500,
            maxWidth: 600,
            outline: 0,
            width: "100%",
        },
    }),
    {
        name: "Navigator",
    }
)

// eslint-disable-next-line unicorn/prevent-abbreviations
export interface NavigatorProps {
    visible: boolean
    setVisibility: (state: boolean) => void
}

const Navigator: React.FC<NavigatorProps> = ({ visible, setVisibility }) => {
    const classes = useStyles({})
    const theme = useTheme()

    return (
        <Modal
            className={classes.modal}
            open={visible}
            onClose={() => setVisibility(false)}
        >
            <Fade appear in={visible} timeout={theme.transitions.duration.short}></Fade>
        </Modal>
    )
}

export default Navigator
