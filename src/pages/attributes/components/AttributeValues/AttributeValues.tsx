// @ts-nocheck
import { Card, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { SortableTableBody, SortableTableRow } from "@mzawadie/components/SortableTable";
import { TablePagination } from "@mzawadie/components/TablePagination";
import {
    renderCollection,
    stopPropagation,
    ListProps,
    ReorderAction,
    RelayToFlat,
} from "@mzawadie/core";
import { AttributeValueListFragment, AttributeInputTypeEnum } from "@mzawadie/graphql";
import { Button, DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface AttributeValuesProps extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">> {
    disabled: boolean;
    values: RelayToFlat<AttributeValueListFragment>;
    onValueAdd: () => void;
    onValueDelete: (id: string) => void;
    onValueReorder: ReorderAction;
    onValueUpdate: (id: string) => void;
    inputType: AttributeInputTypeEnum;
}

const useStyles = makeStyles(
    (theme) => ({
        columnSwatch: {
            width: 100,
        },
        columnAdmin: {
            width: 300,
        },
        columnDrag: {
            width: theme.spacing(6 + 1.5),
        },
        columnStore: {
            width: "auto",
        },
        dragIcon: {
            cursor: "grab",
        },
        iconCell: {
            width: 84,
        },
        link: {
            cursor: "pointer",
        },
        swatch: {
            width: 32,
            height: 32,
            borderRadius: 4,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
    }),
    { name: "AttributeValues" }
);

const AttributeValues: React.FC<AttributeValuesProps> = ({
    disabled,
    onValueAdd,
    onValueDelete,
    onValueReorder,
    onValueUpdate,
    values,
    settings,
    onUpdateListSettings,
    pageInfo,
    onNextPage,
    onPreviousPage,
    inputType,
}) => {
    const classes = useStyles({});
    const intl = useIntl();

    const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
    const numberOfColumns = isSwatch ? 5 : 4;

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Attribute Values",
                    id: "J3uE0t",
                    description: "section header",
                })}
                toolbar={
                    <Button
                        disabled={disabled}
                        variant="tertiary"
                        onClick={onValueAdd}
                        data-test-id="assign-value-button"
                    >
                        <FormattedMessage
                            defaultMessage="Assign value"
                            id="+iVKR1"
                            description="assign attribute value button"
                        />
                    </Button>
                }
            />
            <ResponsiveTable>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.columnDrag} />
                        {isSwatch && (
                            <TableCell className={classes.columnSwatch}>
                                <FormattedMessage
                                    defaultMessage="Swatch"
                                    id="NUevU9"
                                    description="attribute values list: slug column header"
                                />
                            </TableCell>
                        )}
                        <TableCell className={classes.columnAdmin}>
                            <FormattedMessage
                                defaultMessage="Admin"
                                id="3psvRS"
                                description="attribute values list: slug column header"
                            />
                        </TableCell>
                        <TableCell className={classes.columnStore}>
                            <FormattedMessage
                                defaultMessage="Default Store View"
                                id="H60H6L"
                                description="attribute values list: name column header"
                            />
                        </TableCell>
                        <TableCell className={classes.iconCell} />
                    </TableRow>
                </TableHead>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            colSpan={numberOfColumns}
                            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
                            onNextPage={onNextPage}
                            hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : false}
                            onPreviousPage={onPreviousPage}
                            settings={settings}
                            onUpdateListSettings={onUpdateListSettings}
                        />
                    </TableRow>
                </TableFooter>
                <SortableTableBody onSortEnd={onValueReorder}>
                    {renderCollection(
                        values,
                        (value, valueIndex) => (
                            <SortableTableRow
                                className={!!value ? classes.link : undefined}
                                hover={!!value}
                                onClick={!!value ? () => onValueUpdate(value.id) : undefined}
                                key={value?.id}
                                index={valueIndex || 0}
                            >
                                {isSwatch && (
                                    <TableCell className={classes.columnSwatch}>
                                        <div
                                            data-test-id="swatch-image"
                                            className={classes.swatch}
                                            style={
                                                value?.file
                                                    ? { backgroundImage: `url(${value.file.url})` }
                                                    : { backgroundColor: value.value }
                                            }
                                        />
                                    </TableCell>
                                )}
                                <TableCell className={classes.columnAdmin}>
                                    {value?.slug ?? <Skeleton />}
                                </TableCell>
                                <TableCell className={classes.columnStore}>
                                    {value?.name ?? <Skeleton />}
                                </TableCell>
                                <TableCell className={classes.iconCell}>
                                    <IconButton
                                        variant="secondary"
                                        disabled={disabled}
                                        onClick={stopPropagation(() => onValueDelete(value.id))}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </SortableTableRow>
                        ),
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage
                                        defaultMessage="No values found"
                                        id="g5zIpS"
                                        description="No attribute values found"
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </SortableTableBody>
            </ResponsiveTable>
        </Card>
    );
};

AttributeValues.displayName = "AttributeValues";

export default AttributeValues;
