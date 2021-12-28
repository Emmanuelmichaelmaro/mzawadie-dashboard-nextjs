// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import TablePagination from "@mzawadie/components/TablePagination";
import { ListProps, maybe, renderCollection } from "@mzawadie/core";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface TranslatableEntity {
    id: string;
    name: string;
    completion: {
        current: number;
        max: number;
    };
}

export interface TranslationsEntitiesListProps extends Omit<ListProps, "onRowClick"> {
    entities: TranslatableEntity[];
    onRowClick: (code: string) => void;
}

const useStyles = makeStyles(
    {
        tableRow: {
            cursor: "pointer",
        },
        textRight: {
            textAlign: "right",
        },
        wideColumn: {
            width: "80%",
        },
    },
    { name: "TranslationsEntitiesList" }
);

const TranslationsEntitiesList: React.FC<TranslationsEntitiesListProps> = (props) => {
    const { disabled, entities, onNextPage, onPreviousPage, onRowClick, pageInfo } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <ResponsiveTable>
            <TableHead>
                <TableRow>
                    <TableCell className={classes.wideColumn}>
                        <FormattedMessage
                            defaultMessage="Name"
                            id="X6PF8z"
                            description="entity (product, collection, shipping method) name"
                        />
                    </TableCell>

                    <TableCell className={classes.textRight}>
                        <FormattedMessage defaultMessage="Completed Translations" id="LWmYSU" />
                    </TableCell>
                </TableRow>
            </TableHead>

            <TableFooter>
                <TableRow>
                    <TablePagination
                        colSpan={2}
                        hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : undefined}
                        onNextPage={onNextPage}
                        hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : undefined}
                        onPreviousPage={onPreviousPage}
                    />
                </TableRow>
            </TableFooter>

            <TableBody>
                {renderCollection(
                    entities,
                    (entity) => (
                        <TableRow
                            className={classNames({
                                [classes.tableRow]: !!entity,
                            })}
                            hover={!!entity}
                            onClick={entity ? () => onRowClick(entity.id) : undefined}
                            key={entity ? entity.id : "skeleton"}
                        >
                            <TableCell>{entity?.name || <Skeleton />}</TableCell>

                            <TableCell className={classes.textRight}>
                                {!!entity?.completion &&
                                    maybe<React.ReactNode>(
                                        () =>
                                            intl.formatMessage(
                                                {
                                                    defaultMessage: "{current} of {max}",
                                                    id: "ikRuLs",
                                                    description: "translation progress",
                                                },
                                                entity.completion
                                            ),
                                        <Skeleton />
                                    )}
                            </TableCell>
                        </TableRow>
                    ),
                    () => (
                        <TableRow>
                            <TableCell colSpan={2}>
                                <FormattedMessage
                                    defaultMessage="No translatable entities found"
                                    id="vcwrgW"
                                />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

TranslationsEntitiesList.displayName = "TranslationsEntitiesList";

export default TranslationsEntitiesList;
