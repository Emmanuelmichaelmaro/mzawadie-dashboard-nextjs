import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
    () => ({
        container: {
            display: "grid",
            gridTemplateRows: "repeat(auto-fill, minmax(90px, 1fr))",
            justifyContent: "end",
            left: 0,
            pointerEvents: "none",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 10_000,
        },
        notification: {
            // Parent container has disabled pointer events so we need to turn them on
            // for action and timer pausing to work
            pointerEvents: "all",
        },
    }),
    { name: "MessageManager" }
);

export default useStyles;
