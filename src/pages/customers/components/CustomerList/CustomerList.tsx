// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import RequirePermissions, { hasPermissions } from "@mzawadie/components/RequirePermissions";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { TableHead } from "@mzawadie/components/TableHead";
import { TablePaginationWithContext } from "@mzawadie/components/TablePagination";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { getUserName, renderCollection } from "@mzawadie/core";
import { ListActions, ListProps, RelayToFlat, SortPage } from "@mzawadie/core";
import { ListCustomersQuery, PermissionEnum } from "@mzawadie/graphql";
import { useUserPermissions } from "@mzawadie/pages/auth/hooks/useUserPermissions";
import { CustomerListUrlSortField, customerUrl } from "@mzawadie/pages/customers/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        [theme.breakpoints.up("lg")]: {
            colEmail: {},
            colName: {},
            colOrders: {
                width: 200,
            },
        },
        colEmail: {},
        colName: {
            paddingLeft: 0,
        },
        colOrders: {
            textAlign: "center",
        },
        tableRow: {
            cursor: "pointer",
        },
    }),
    { name: "CustomerList" }
);

export interface CustomerListProps extends ListProps, ListActions, SortPage<CustomerListUrlSortField> {
    customers: RelayToFlat<ListCustomersQuery["customers"]>;
}

const CustomerList: React.FC<CustomerListProps> = (props) => {
    const {
        settings,
        disabled,
        customers,
        onUpdateListSettings,
        onSort,
        toolbar,
        toggle,
        toggleAll,
        selected,
        sort,
        isChecked,
    } = props;

    const userPermissions = useUserPermissions();

    const numberOfColumns = hasPermissions(userPermissions, [PermissionEnum.MANAGE_ORDERS]) ? 4 : 3;

    const classes = useStyles(props);

    return (
        <ResponsiveTable>
            <TableHead
                colSpan={numberOfColumns}
                selected={selected}
                disabled={disabled}
                items={customers}
                toggleAll={toggleAll}
                toolbar={toolbar}
            >
                <TableCellHeader
                    direction={
                        sort.sort === CustomerListUrlSortField.name
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    arrowPosition="right"
                    onClick={() => onSort(CustomerListUrlSortField.name)}
                    className={classes.colName}
                >
                    <FormattedMessage id="Gr1SAu" defaultMessage="Customer Name" />
                </TableCellHeader>
        
                <TableCellHeader
                    direction={
                        sort.sort === CustomerListUrlSortField.email
                            ? getArrowDirection(sort.asc)
                            : undefined
                    }
                    onClick={() => onSort(CustomerListUrlSortField.email)}
                    className={classes.colEmail}
                >
                    <FormattedMessage id="97l2MO" defaultMessage="Customer Email" />
                </TableCellHeader>
        
                <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                    <TableCellHeader
                        direction={
                            sort.sort === CustomerListUrlSortField.orders
                                ? getArrowDirection(sort.asc)
                                : undefined
                        }
                        textAlign="center"
                        onClick={() => onSort(CustomerListUrlSortField.orders)}
                        className={classes.colOrders}
                    >
                        <FormattedMessage id="E8VDeH" defaultMessage="No. of Orders" />
                    </TableCellHeader>
                </RequirePermissions>
            </TableHead>
        
            <TableFooter>
                <TableRow>
                    <TablePaginationWithContext
                        colSpan={numberOfColumns}
                        settings={settings}
                        onUpdateListSettings={onUpdateListSettings}
                    />
                </TableRow>
            </TableFooter>
        
            <TableBody>
                {renderCollection(
                    customers,
                    (customer) => {
                        const isSelected = customer ? isChecked(customer.id) : false;

                        return (
                            <TableRowLink
                                className={!!customer ? classes.tableRow : undefined}
                                hover={!!customer}
                                key={customer ? customer.id : "skeleton"}
                                selected={isSelected}
                                href={customer && customerUrl(customer.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={disabled}
                                        disableClickPropagation
                                        onChange={() => toggle(customer.id)}
                                    />
                                </TableCell>
        
                                <TableCell className={classes.colName}>
                                    {getUserName(customer)}
                                </TableCell>
        
                                <TableCell className={classes.colEmail}>
                                    {customer?.email ?? <Skeleton />}
                                </TableCell>
        
                                <RequirePermissions
                                    requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
                                >
                                    <TableCell className={classes.colOrders}>
                                        {customer?.orders?.totalCount ?? <Skeleton />}
                                    </TableCell>
                                </RequirePermissions>
                            </TableRowLink>
                        );
                    },
                    () => (
                        <TableRow>
                            <TableCell colSpan={numberOfColumns}>
                                <FormattedMessage id="FpIcp9" defaultMessage="No customers found" />
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

CustomerList.displayName = "CustomerList";

export default CustomerList;
