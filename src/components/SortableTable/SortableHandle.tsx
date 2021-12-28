/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TableCell } from "@material-ui/core";
import Draggable from "@mzawadie/icons/Draggable";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

const useStyles = makeStyles(
    (theme) => ({
        columnDrag: {
            "&:first-child": {
                paddingRight: theme.spacing(2),
            },
            cursor: "grab",
            width: `calc(48px + ${theme.spacing(1.5)})`,
        },
    }),
    { name: "SortableHandle" }
);

const SortableHandle = SortableHandleHoc(() => {
    const classes = useStyles({});

    return (
        <TableCell className={classes.columnDrag}>
            <Draggable />
        </TableCell>
    );
});

export default SortableHandle;
