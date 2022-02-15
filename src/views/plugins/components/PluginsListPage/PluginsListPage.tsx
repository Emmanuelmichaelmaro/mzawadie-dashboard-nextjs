// @ts-nocheck
import { Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import FilterBar from "@mzawadie/components/FilterBar";
import PageHeader from "@mzawadie/components/PageHeader";
import { sectionNames, FilterPageProps, PageListProps, SortPage, TabPageProps } from "@mzawadie/core";
import { PluginListUrlSortField } from "@mzawadie/views/plugins/urls";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { Plugins_plugins_edges_node } from "../../types/Plugins";
import PluginsList from "../PluginsList/PluginsList";
import { createFilterStructure, PluginFilterKeys, PluginListFilterOpts } from "./filters";
import { pluginsFilterErrorMessages } from "./messages";

export interface PluginsListPageProps
    extends PageListProps,
        FilterPageProps<PluginFilterKeys, PluginListFilterOpts>,
        SortPage<PluginListUrlSortField>,
        TabPageProps {
    plugins: Plugins_plugins_edges_node[];
    onBack: () => void;
}

const PluginsListPage: React.FC<PluginsListPageProps> = ({
    currentTab,
    initialSearch,
    filterOpts,
    tabs,
    onAdd,
    onAll,
    onBack,
    onSearchChange,
    onFilterChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    ...listProps
}) => {
    const intl = useIntl();

    const filterStructure = createFilterStructure(intl, filterOpts);

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>
            <PageHeader title={intl.formatMessage(sectionNames.plugins)} />
            <Card>
                <FilterBar
                    errorMessages={pluginsFilterErrorMessages}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                    tabs={tabs}
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Plugins",
                        id: "aOelhW",
                        description: "tab name",
                    })}
                    filterStructure={filterStructure}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Plugins...",
                        id: "BtErCZ",
                    })}
                />
                <PluginsList {...listProps} />
            </Card>
        </Container>
    );
};

PluginsListPage.displayName = "PluginsListPage";

export default PluginsListPage;
