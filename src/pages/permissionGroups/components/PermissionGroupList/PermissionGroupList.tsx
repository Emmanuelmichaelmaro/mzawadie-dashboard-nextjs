// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { maybe, renderCollection, stopPropagation, ListProps, SortPage } from "@mzawadie/core";
import { PermissionGroupList_permissionGroups_edges_node } from "@mzawadie/pages/permissionGroups/types/PermissionGroupList";
import { PermissionGroupListUrlSortField } from "@mzawadie/pages/permissionGroups/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colActions: {
                width: 180,
            },
            colMembers: {
                width: 180,
            },
            colName: {
                width: "auto",
            },
        },
        colActions: {
            paddingRight: theme.spacing(),
            textAlign: "right",
        },
        colActionsHeader: {
            textAlign: "right",
        },
        colMembers: {
            textAlign: "right",
        },
        colName: {
            paddingLeft: 0,
        },
        link: {
            cursor: "pointer",
        },
    }),
    { name: "PermissionGroupList" }
);

const numberOfColumns = 3;

interface PermissionGroupListProps extends ListProps, SortPage<PermissionGroupListUrlSortField> {
    permissionGroups: PermissionGroupList_permissionGroups_edges_node[];
    onDelete: (id: string) => void;
}

const PermissionGroupList: React.FC<PermissionGroupListProps> = (props) => {
    const {
        disabled,
        permissionGroups,
        pageInfo,
        onDelete,
        onNextPage,
        onPreviousPage,
        onRowClick,
        onSort,
        sort,
    } = props;

    const classes = useStyles(props);

    return (
        <ResponsiveTable>
            <TableHead>
                <TableRow>
                    <TableCellHeader
                        direction={
                            sort.sort === PermissionGroupListUrlSortField.name
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        arrowPosition="right"
                        onClick={() => onSort(PermissionGroupListUrlSortField.name)}
                        className={classes.colName}
                    >
                        <FormattedMessage
                            defaultMessage="Permission Group Name"
                            id="szXISP"
                            description="permission group name"
                        />
                    </TableCellHeader>

                    <TableCellHeader className={classes.colMembers} textAlign="right">
                        <FormattedMessage defaultMessage="Members" id="+a+2ug" />
                    </TableCellHeader>

                    <TableCell className={classes.colActionsHeader}>
                        <FormattedMessage defaultMessage="Actions" id="wL7VAE" />
                    </TableCell>
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
                    />
                </TableRow>
            </TableFooter>

            <TableBody>
                {renderCollection(
                    permissionGroups,
                    (permissionGroup) => (
                        <TableRow
                            className={!!permissionGroup ? classes.link : undefined}
                            hover={!!permissionGroup}
                            key={permissionGroup ? permissionGroup.id : "skeleton"}
                            onClick={permissionGroup ? onRowClick(permissionGroup.id) : undefined}
                            data-test-id={`id-${maybe(() => permissionGroup.id)}`}
                        >
                            <TableCell className={classes.colName}>
                                {permissionGroup ? (
                                    <span data-test-id="name">{permissionGroup.name}</span>
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>

                            <TableCell className={classes.colMembers}>
                                {permissionGroup ? (
                                    <span data-test-id="members">{permissionGroup.users.length}</span>
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>

                            <TableCell className={classes.colActions}>
                                {permissionGroup ? (
                                    <>
                                        {permissionGroup.userCanManage && (
                                            <IconButton
                                                variant="secondary"
                                                data-test-id="delete-icon"
                                                color="primary"
                                                onClick={stopPropagation(() =>
                                                    onDelete(permissionGroup.id)
                                                )}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </>
                                ) : (
                                    <Skeleton />
                                )}
                            </TableCell>
                        </TableRow>
                    ),
                    () => (
                        <TableRow>
                            <TableCell colSpan={numberOfColumns}>
                                <FormattedMessage
                                    defaultMessage="No permission groups found"
                                    id="CXn88q"
                                />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

PermissionGroupList.displayName = "PermissionGroupList";

export default PermissionGroupList;
