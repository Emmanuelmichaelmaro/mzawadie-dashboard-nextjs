// @ts-nocheck
import { Card } from "@material-ui/core";
import { attributeAddUrl, AttributeListUrlSortField } from "@mzawadie/pages/attributes/urls";
import { Backlink } from "@mzawadie/components/Backlink";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import {FilterBar} from "@mzawadie/components/FilterBar";
import {PageHeader} from "@mzawadie/components/PageHeader";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { sectionNames } from "@mzawadie/core";
import { FilterPageProps, ListActions, PageListProps, SortPage, TabPageProps } from "@mzawadie/core";
import { AttributeFragment } from "@mzawadie/graphql";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AttributeList from "../AttributeList/AttributeList";
import { AttributeFilterKeys, AttributeListFilterOpts, createFilterStructure } from "./filters";

export interface AttributeListPageProps
    extends PageListProps,
        ListActions,
        FilterPageProps<AttributeFilterKeys, AttributeListFilterOpts>,
        SortPage<AttributeListUrlSortField>,
        TabPageProps {
    attributes: AttributeFragment[];
}

const AttributeListPage: React.FC<AttributeListPageProps> = ({
    filterOpts,
    initialSearch,
    onFilterChange,
    onSearchChange,
    currentTab,
    onAll,
    onTabChange,
    onTabDelete,
    onTabSave,
    tabs,
    ...listProps
}) => {
    const intl = useIntl();

    const structure = createFilterStructure(intl, filterOpts);

    return (
        <Container>
            <Backlink href={configurationMenuUrl}>
                <FormattedMessage {...sectionNames.configuration} />
            </Backlink>

            <PageHeader title={intl.formatMessage(sectionNames.attributes)}>
                <Button
                    href={attributeAddUrl()}
                    variant="primary"
                    data-test-id="create-attribute-button"
                >
                    <FormattedMessage
                        id="IGvQ8k"
                        defaultMessage="Create attribute"
                        description="button"
                    />
                </Button>
            </PageHeader>

            <Card>
                <FilterBar
                    allTabLabel={intl.formatMessage({
                        id: "dKPMyh",
                        defaultMessage: "All Attributes",
                        description: "tab name",
                    })}
                    currentTab={currentTab}
                    filterStructure={structure}
                    initialSearch={initialSearch}
                    searchPlaceholder={intl.formatMessage({
                        id: "1div9r",
                        defaultMessage: "Search Attribute",
                    })}
                    tabs={tabs}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                />
                <AttributeList {...listProps} />
            </Card>
        </Container>
    );
};

AttributeListPage.displayName = "AttributeListPage";

export default AttributeListPage;
