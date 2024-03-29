// @ts-nocheck
import { Card } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import Container from "@mzawadie/components/Container";
import { FilterBar } from "@mzawadie/components/FilterBar";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { sectionNames } from "@mzawadie/core";
import { FilterPageProps, PageListProps, SortPage, TabPageProps } from "@mzawadie/core";
import { PluginBaseFragment } from "@mzawadie/graphql";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { PluginListUrlSortField } from "@mzawadie/pages/plugins/urls";
import React from "react";
import { useIntl } from "react-intl";

import PluginsList from "../PluginsList/PluginsList";
import { createFilterStructure, PluginFilterKeys, PluginListFilterOpts } from "./filters";
import { pluginsFilterErrorMessages } from "./messages";

export interface PluginsListPageProps
    extends PageListProps,
        FilterPageProps<PluginFilterKeys, PluginListFilterOpts>,
        SortPage<PluginListUrlSortField>,
        TabPageProps {
    plugins: PluginBaseFragment[];
}

const PluginsListPage: React.FC<PluginsListPageProps> = ({
    currentTab,
    initialSearch,
    filterOpts,
    tabs,
    onAll,
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
            <Backlink href={configurationMenuUrl}>
                {intl.formatMessage(sectionNames.configuration)}
            </Backlink>

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
                        id: "aOelhW",
                        defaultMessage: "All Plugins",
                        description: "tab name",
                    })}
                    filterStructure={filterStructure}
                    searchPlaceholder={intl.formatMessage({
                        id: "BtErCZ",
                        defaultMessage: "Search Plugins...",
                    })}
                />

                <PluginsList {...listProps} />
            </Card>
        </Container>
    );
};

PluginsListPage.displayName = "PluginsListPage";

export default PluginsListPage;
