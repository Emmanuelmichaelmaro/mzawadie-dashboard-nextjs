// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from "@material-ui/core";
import ResponsiveTable from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import TableCellHeader from "@mzawadie/components/TableCellHeader";
import TablePagination from "@mzawadie/components/TablePagination";
import {
    getUserInitials,
    getUserName,
    maybe,
    renderCollection,
    ListProps,
    SortPage,
} from "@mzawadie/core";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { StaffListUrlSortField } from "@mzawadie/views/staff/urls";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StaffList_staffUsers_edges_node } from "../../types/StaffList";

const useStyles = makeStyles(
    (theme) => ({
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
        colEmail: {
            width: 400,
        },
        statusText: {
            color: "#9E9D9D",
        },
        tableRow: {
            cursor: "pointer",
        },
        wideColumn: {
            width: "80%",
        },
    }),
    { name: "StaffList" }
);

interface StaffListProps extends ListProps, SortPage<StaffListUrlSortField> {
    staffMembers: StaffList_staffUsers_edges_node[];
}

const numberOfColumns = 2;

const StaffList: React.FC<StaffListProps> = (props) => {
    const {
        settings,
        disabled,
        onNextPage,
        onPreviousPage,
        onUpdateListSettings,
        onRowClick,
        onSort,
        pageInfo,
        sort,
        staffMembers,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <ResponsiveTable>
            <colgroup>
                <col />
                <col className={classes.colEmail} />
            </colgroup>
            <TableHead>
                <TableRow>
                    <TableCellHeader
                        direction={
                            sort.sort === StaffListUrlSortField.name
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        arrowPosition="right"
                        onClick={() => onSort(StaffListUrlSortField.name)}
                        className={classes.wideColumn}
                    >
                        <FormattedMessage
                            defaultMessage="Name"
                            id="W32xfN"
                            description="staff member full name"
                        />
                    </TableCellHeader>
                    <TableCellHeader
                        direction={
                            sort.sort === StaffListUrlSortField.email
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        onClick={() => onSort(StaffListUrlSortField.email)}
                    >
                        <FormattedMessage defaultMessage="Email Address" id="xxQxLE" />
                    </TableCellHeader>
                </TableRow>
            </TableHead>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        colSpan={numberOfColumns}
                        settings={settings}
                        hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : undefined}
                        onNextPage={onNextPage}
                        onUpdateListSettings={onUpdateListSettings}
                        hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : undefined}
                        onPreviousPage={onPreviousPage}
                    />
                </TableRow>
            </TableFooter>
            <TableBody>
                {renderCollection(
                    staffMembers,
                    (staffMember) => (
                        <TableRow
                            className={classNames({
                                [classes.tableRow]: !!staffMember,
                            })}
                            hover={!!staffMember}
                            onClick={staffMember ? onRowClick(staffMember.id) : undefined}
                            key={staffMember ? staffMember.id : "skeleton"}
                        >
                            <TableCell>
                                <div className={classes.avatar}>
                                    {maybe(() => staffMember.avatar.url) ? (
                                        <img
                                            className={classes.avatarImage}
                                            src={maybe(() => staffMember.avatar.url)}
                                            alt="Staff member"
                                        />
                                    ) : (
                                        <div className={classes.avatarDefault}>
                                            <Typography>{getUserInitials(staffMember)}</Typography>
                                        </div>
                                    )}
                                </div>
                                <Typography>{getUserName(staffMember) || <Skeleton />}</Typography>
                                <Typography variant="caption" className={classes.statusText}>
                                    {maybe<React.ReactNode>(
                                        () =>
                                            staffMember.isActive
                                                ? intl.formatMessage({
                                                      defaultMessage: "Active",
                                                      id: "9Zlogd",
                                                      description: "staff member status",
                                                  })
                                                : intl.formatMessage({
                                                      defaultMessage: "Inactive",
                                                      id: "7WzUxn",
                                                      description: "staff member status",
                                                  }),
                                        <Skeleton />
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {maybe<React.ReactNode>(() => staffMember.email, <Skeleton />)}
                            </TableCell>
                        </TableRow>
                    ),
                    () => (
                        <TableRow>
                            <TableCell colSpan={numberOfColumns}>
                                <FormattedMessage defaultMessage="No staff members found" id="xJQX5t" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

StaffList.displayName = "StaffList";

export default StaffList;
