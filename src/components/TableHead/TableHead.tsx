// @ts-nocheck
import { TableCell, TableHead as MuiTableHead, TableRow, Typography } from "@material-ui/core";
import { TableHeadProps as MuiTableHeadProps } from "@material-ui/core/TableHead";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { Checkbox } from "@mzawadie/components";
import { Node } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface TableHeadProps extends MuiTableHeadProps {
    colSpan: number;
    disabled: boolean;
    dragRows?: boolean;
    selected?: number;
    items: Node[] | undefined;
    toolbar?: React.ReactNode | React.ReactNodeArray;
    toggleAll?: (items: Node[], selected: number) => void;
}

const useStyles = makeStyles(
    (theme) => ({
        cell: {
            padding: 0,
        },
        checkboxSelected: {
            backgroundColor: fade(theme.palette.primary.main, 0.05),
        },
        container: {
            alignItems: "center",
            display: "flex",
            height: 47,
            marginRight: theme.spacing(-2),
        },
        dragRows: {
            padding: 0,
            width: 52,
        },
        padding: {
            "&:last-child": {
                padding: 0,
            },
        },
        root: {
            backgroundColor: fade(theme.palette.primary.main, 0.05),
            paddingLeft: 0,
            paddingRight: 24,
        },
        spacer: {
            flex: 1,
        },
        toolbar: {
            "& > *": {
                marginLeft: theme.spacing(1),
            },
        },
    }),
    { name: "TableHead" }
);

function getColSpan(colSpan: number, dragRows: boolean): number {
    if (dragRows) {
        return colSpan - 2;
    }

    return colSpan - 1;
}

const TableHead: React.FC<TableHeadProps> = (props) => {
    const {
        children,
        colSpan,
        disabled,
        dragRows,
        items,
        selected,
        toggleAll,
        toolbar,
        ...muiTableHeadProps
    } = props;
    const classes = useStyles(props);

    return (
        <MuiTableHead {...muiTableHeadProps}>
            <TableRow>
                {dragRows && (items === undefined || items.length > 0) && (
                    <TableCell
                        className={classNames({
                            [classes.checkboxSelected]: selected,
                        })}
                    />
                )}

                {(items === undefined || items.length > 0) && (
                    <TableCell
                        padding="checkbox"
                        className={classNames({
                            [classes.checkboxSelected]: selected,
                            [classes.dragRows]: dragRows,
                        })}
                    >
                        <Checkbox
                            indeterminate={items && items.length > selected && selected > 0}
                            checked={selected !== 0}
                            disabled={disabled}
                            onChange={() => toggleAll(items, selected)}
                        />
                    </TableCell>
                )}

                {selected ? (
                    <>
                        <TableCell
                            className={classNames(classes.root)}
                            colSpan={getColSpan(colSpan, dragRows)}
                        >
                            <div className={classes.container}>
                                {selected && (
                                    <Typography>
                                        <FormattedMessage
                                            defaultMessage="Selected {number} items"
                                            id="qu/hXD"
                                            values={{
                                                number: selected,
                                            }}
                                        />
                                    </Typography>
                                )}
                                <div className={classes.spacer} />
                                {toolbar && <div className={classes.toolbar}>{toolbar}</div>}
                            </div>
                        </TableCell>
                    </>
                ) : (
                    children
                )}
            </TableRow>
        </MuiTableHead>
    );
};

TableHead.displayName = "TableHead";

export default TableHead;
