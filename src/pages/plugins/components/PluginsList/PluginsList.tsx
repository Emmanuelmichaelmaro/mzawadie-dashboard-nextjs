// @ts-nocheck
import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TablePaginationWithContext } from "@mzawadie/components/TablePagination";
import { renderCollection } from "@mzawadie/core";
import { ListProps, SortPage } from "@mzawadie/core";
import { PluginBaseFragment } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { PluginListUrlSortField, pluginUrl } from "@mzawadie/pages/plugins/urls";
import { EditIcon, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

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
    plugins: PluginBaseFragment[];
}

const totalColSpan = 10;

const PluginList: React.FC<PluginListProps> = (props) => {
    const { settings, plugins, disabled, sort, onSort, onUpdateListSettings } = props;

    const classes = useStyles(props);
    const navigate = useNavigator();
    const intl = useIntl();

    return (
        <ResponsiveTable>
            <PluginListTableHead sort={sort} onSort={onSort} />

            <TableFooter>
                <TableRow>
                    <TablePaginationWithContext
                        colSpan={totalColSpan}
                        onUpdateListSettings={onUpdateListSettings}
                        settings={settings}
                        disabled={disabled}
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
                                // FIXME: middle click doesn't work - issues with deployments
                                // shows 404 not found
                                onClick={() => plugin && navigate(pluginUrl(plugin.id))}
                                key={plugin ? plugin.id : "skeleton"}
                            >
                                <TableCell colSpan={5}>{plugin.name}</TableCell>
                                <PluginChannelConfigurationCell plugin={plugin} />
                                <PluginChannelAvailabilityCell plugin={plugin} />
                                <TableCell align="right">
                                    <EditIcon />
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
                                    id: "Co2U4u",
                                    defaultMessage: "No plugins found",
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
