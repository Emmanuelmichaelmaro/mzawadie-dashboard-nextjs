import { TableHead } from "@material-ui/core";
import { TableCellHeader } from "@mzawadie/components/TableCellHeader";
import { SortPage } from "@mzawadie/core";
import { PluginListUrlSortField } from "@mzawadie/pages/plugins/urls";
import { getArrowDirection } from "@mzawadie/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import { pluginsListTableHeadMessages as messages } from "./messages";

type PluginListTableHeadProps = SortPage<PluginListUrlSortField>;

const PluginListTableHead: React.FC<PluginListTableHeadProps> = ({ sort, onSort }) => {
    const intl = useIntl();

    return (
        <TableHead>
            <TableCellHeader
                direction={
                    sort.sort === PluginListUrlSortField.name ? getArrowDirection(sort.asc) : undefined
                }
                arrowPosition="right"
                onClick={() => onSort(PluginListUrlSortField.name)}
                colSpan={5}
            >
                {intl.formatMessage(messages.nameLabel)}
            </TableCellHeader>
            <TableCellHeader
                colSpan={2}
                direction={
                    sort.sort === PluginListUrlSortField.active
                        ? getArrowDirection(sort.asc)
                        : undefined
                }
                onClick={() => onSort(PluginListUrlSortField.active)}
            >
                {intl.formatMessage(messages.confLabel)}
            </TableCellHeader>
            <TableCellHeader colSpan={2}>{intl.formatMessage(messages.channelLabel)}</TableCellHeader>
            <TableCellHeader />
        </TableHead>
    );
};

export default PluginListTableHead;
