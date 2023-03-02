// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TablePagination } from "@mzawadie/components/TablePagination";
import { renderCollection, ListProps, SortPage } from "@mzawadie/core";
import { PluginListUrlSortField } from "@mzawadie/pages/plugins/urls";
import { EditIcon, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { Plugins_plugins_edges_node } from "../../types/Plugins";
import PluginChannelAvailabilityCell from "./PluginChannelAvailabilityCell";
import PluginChannelConfigurationCell from "./PluginChannelConfigurationCell";
import PluginListTableHead from "./PluginListTableHead";

export const useStyles = makeStyles(
    () => ({
        link: {
            cursor: "pointer",
        },
    }),
    { name: "PluginsList" }
);

export interface PluginListProps extends ListProps, SortPage<PluginListUrlSortField> {
    plugins: Plugins_plugins_edges_node[];
}

const totalColSpan = 10;

const PluginList: React.FC<PluginListProps> = (props) => {
    const {
        settings,
        plugins,
        disabled,
        onNextPage,
        pageInfo,
        sort,
        onRowClick,
        onSort,
        onUpdateListSettings,
        onPreviousPage,
    } = props;
    const classes = useStyles(props);
    const intl = useIntl();

    return (
        <ResponsiveTable>
            <PluginListTableHead sort={sort} onSort={onSort} />
            <TableFooter>
                <TableRow>
                    <TablePagination
                        colSpan={totalColSpan}
                        settings={settings}
                        hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
                        onNextPage={onNextPage}
                        onUpdateListSettings={onUpdateListSettings}
                        hasPreviousPage={pageInfo && !disabled ? pageInfo.hasPreviousPage : false}
                        onPreviousPage={onPreviousPage}
                    />
                </TableRow>
            </TableFooter>
            <TableBody>
                {renderCollection(
                    plugins,
                    (plugin) =>
                        plugin ? (
                            <TableRow
                                data-test-id="plugin"
                                hover={!!plugin}
                                className={!!plugin ? classes.link : undefined}
                                onClick={plugin ? onRowClick(plugin.id) : undefined}
                                key={plugin ? plugin.id : "skeleton"}
                            >
                                <TableCell colSpan={5}>{plugin.name}</TableCell>
                                <PluginChannelConfigurationCell plugin={plugin} />
                                <PluginChannelAvailabilityCell plugin={plugin} />
                                <TableCell align="right">
                                    <div onClick={plugin ? onRowClick(plugin.id) : undefined}>
                                        <EditIcon />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={totalColSpan}>
                                    <Skeleton />
                                </TableCell>
                            </TableRow>
                        ),
                    () => (
                        <TableRow>
                            <TableCell colSpan={totalColSpan}>
                                {intl.formatMessage({
                                    defaultMessage: "No plugins found",
                                    id: "Co2U4u",
                                })}
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </ResponsiveTable>
    );
};

PluginList.displayName = "PluginList";

export default PluginList;
