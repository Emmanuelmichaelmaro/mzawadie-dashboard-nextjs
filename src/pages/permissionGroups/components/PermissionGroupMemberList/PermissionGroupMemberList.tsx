/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
import { Card, CardContent, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import {
    getUserInitials,
    getUserName,
    renderCollection,
    stopPropagation,
    ListActions,
    SortPage,
} from "@mzawadie/core";
import { PermissionGroupMemberFragment } from "@mzawadie/graphql";
import { sortMembers } from "@mzawadie/pages/permissionGroups/sort";
import { MembersListUrlSortField } from "@mzawadie/pages/permissionGroups/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { Button, DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colActions: {
                width: 120,
            },
            colEmail: {
                width: 300,
            },
            colName: {
                width: "auto",
            },
        },
        avatar: {
            alignItems: "center",
            borderRadius: "100%",
            display: "grid",
            float: "left",
            height: 47,
            justifyContent: "center",
            marginRight: theme.spacing(1),
            overflow: "hidden",
            width: 47,
        },
        avatarDefault: {
            "& div": {
                color: theme.palette.primary.contrastText,
                lineHeight: "47px",
            },
            background: theme.palette.primary.main,
            height: 47,
            textAlign: "center",
            width: 47,
        },
        avatarImage: {
            pointerEvents: "none",
            width: "100%",
        },
        colActions: {
            paddingRight: theme.spacing(),
            textAlign: "right",
        },
        helperText: {
            textAlign: "center",
        },
        statusText: {
            color: "#9E9D9D",
        },
        tableRow: {},
    }),
    { name: "PermissionGroup" }
);
const numberOfColumns = 4;

interface PermissionGroupProps extends ListActions, SortPage<MembersListUrlSortField> {
    users: PermissionGroupMemberFragment[];
    disabled: boolean;
    onUnassign: (ida: string[]) => void;
    onAssign: () => void;
}

const PermissionGroupMemberList: React.FC<PermissionGroupProps> = (props) => {
    const {
        disabled,
        users,
        onUnassign,
        onAssign,
        onSort,
        toggle,
        toolbar,
        isChecked,
        selected,
        toggleAll,
        sort,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    const members = users?.sort(sortMembers(sort?.sort, sort?.asc));

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Group members",
                    id: "lGlDEH",
                    description: "header",
                })}
                toolbar={
                    <Button
                        data-test-id="assign-members"
                        color={disabled ? "secondary" : "primary"}
                        onClick={onAssign}
                        disabled={disabled}
                    >
                        <FormattedMessage
                            defaultMessage="Assign members"
                            id="OhFGpX"
                            description="button"
                        />
                    </Button>
                }
            />
            {members?.length === 0 ? (
                <CardContent className={classes.helperText}>
                    <Typography color="textSecondary">
                        <FormattedMessage
                            defaultMessage="You haven’t assigned any member to this permission group yet."
                            id="gVD1os"
                            description="empty list message"
                        />
                    </Typography>
                    <Typography color="textSecondary">
                        <FormattedMessage
                            defaultMessage="Please use Assign Members button to do so."
                            id="zD7/M6"
                            description="empty list message"
                        />
                    </Typography>
                </CardContent>
            ) : (
                <ResponsiveTable>
                    <TableHead
                        colSpan={numberOfColumns}
                        selected={selected}
                        disabled={disabled}
                        items={members}
                        toggleAll={toggleAll}
                        toolbar={toolbar}
                    >
                        <TableCellHeader
                            className={classes.colName}
                            arrowPosition="right"
                            onClick={() => onSort(MembersListUrlSortField.name)}
                            direction={
                                sort?.sort === MembersListUrlSortField.name
                                    ? getArrowDirection(sort.asc)
                                    : undefined
                            }
                        >
                            <FormattedMessage
                                defaultMessage="Name"
                                id="W32xfN"
                                description="staff member full name"
                            />
                        </TableCellHeader>
                        <TableCellHeader
                            className={classes.colEmail}
                            arrowPosition="right"
                            onClick={() => onSort(MembersListUrlSortField.email)}
                            direction={
                                sort?.sort === MembersListUrlSortField.email
                                    ? getArrowDirection(sort.asc)
                                    : undefined
                            }
                        >
                            <FormattedMessage defaultMessage="Email Address" id="xxQxLE" />
                        </TableCellHeader>
                        <TableCellHeader textAlign="right">
                            <FormattedMessage defaultMessage="Actions" id="wL7VAE" />
                        </TableCellHeader>
                    </TableHead>
                    <TableBody>
                        {renderCollection(
                            members,
                            (user) => {
                                const isSelected = user ? isChecked(user.id) : false;

                                return (
                                    <TableRow
                                        className={classNames({
                                            [classes.tableRow]: !!user,
                                        })}
                                        hover={!!user}
                                        selected={isSelected}
                                        key={user ? user.id : "skeleton"}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                disabled={disabled}
                                                disableClickPropagation
                                                onChange={() => toggle(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.colName}>
                                            <div className={classes.avatar}>
                                                {user?.avatar?.url ? (
                                                    <img
                                                        className={classes.avatarImage}
                                                        src={user?.avatar?.url}
                                                    />
                                                ) : (
                                                    <div className={classes.avatarDefault}>
                                                        <Typography>{getUserInitials(user)}</Typography>
                                                    </div>
                                                )}
                                            </div>
                                            <Typography>{getUserName(user) || <Skeleton />}</Typography>
                                            <Typography
                                                variant="caption"
                                                className={classes.statusText}
                                            >
                                                {!user ? (
                                                    <Skeleton />
                                                ) : user.isActive ? (
                                                    intl.formatMessage({
                                                        defaultMessage: "Active",
                                                        id: "9Zlogd",
                                                        description: "staff member status",
                                                    })
                                                ) : (
                                                    intl.formatMessage({
                                                        defaultMessage: "Inactive",
                                                        id: "7WzUxn",
                                                        description: "staff member status",
                                                    })
                                                )}
                                            </Typography>
                                        </TableCell>
                                        <TableCell className={classes.colEmail}>
                                            {user?.email || <Skeleton />}
                                        </TableCell>
                                        <TableCell className={classes.colActions}>
                                            {user ? (
                                                <>
                                                    <IconButton
                                                        variant="secondary"
                                                        data-test-id="remove-user"
                                                        disabled={disabled}
                                                        color="primary"
                                                        onClick={stopPropagation(() =>
                                                            onUnassign([user.id])
                                                        )}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <Skeleton />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            },
                            () => (
                                <TableRow>
                                    <TableCell colSpan={numberOfColumns}>
                                        <FormattedMessage
                                            defaultMessage="No members found"
                                            id="qrWOxx"
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </ResponsiveTable>
            )}
        </Card>
    );
};

PermissionGroupMemberList.displayName = "PermissionGroupMemberList";

export default PermissionGroupMemberList;
