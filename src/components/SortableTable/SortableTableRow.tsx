/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TableRow } from "@material-ui/core";
import { TableRowProps } from "@material-ui/core/TableRow";
import React from "react";
import { SortableElement } from "react-sortable-hoc";

import SortableHandle from "./SortableHandle";

const SortableTableRow = SortableElement<TableRowProps>(({ children, ...props }: any) => (
    <TableRow {...props}>
        <SortableHandle />
        {children}
    </TableRow>
));

export default SortableTableRow;
