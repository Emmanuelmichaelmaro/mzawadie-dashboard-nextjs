// @ts-nocheck
import Draggable from "@mzawadie/icons/Draggable";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { SortableHandle as SortableHandleHoc } from "react-sortable-hoc";

const useStyles = makeStyles(
    {
        drag: {
            cursor: "grab",
        },
    },
    { name: "SortableHandle" }
);

interface SortableHandle {
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const SortableHandle = SortableHandleHoc((props: any) => {
    const { className, ...restProps } = props;
    const classes = useStyles(props);

    return <Draggable className={classNames(classes.drag, className)} {...restProps} />;
});

export default SortableHandle;
