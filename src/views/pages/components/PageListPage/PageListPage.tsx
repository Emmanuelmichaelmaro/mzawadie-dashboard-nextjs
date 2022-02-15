import { Button } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import PageHeader from "@mzawadie/components/PageHeader";
import { sectionNames, ListActions, PageListProps, SortPage } from "@mzawadie/core";
import { PageListUrlSortField } from "@mzawadie/views/pages/urls";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageList_pages_edges_node } from "../../types/PageList";
import PageList from "../PageList";

export interface PageListPageProps extends PageListProps, ListActions, SortPage<PageListUrlSortField> {
    pages: PageList_pages_edges_node[];
    onBack: () => void;
}

const PageListPage: React.FC<PageListPageProps> = ({ onAdd, onBack, ...listProps }) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>

            <PageHeader title={intl.formatMessage(sectionNames.pages)}>
                <Button onClick={onAdd} variant="contained" color="primary" data-test-id="createPage">
                    <FormattedMessage defaultMessage="Create page" id="AHRDWt" description="button" />
                </Button>
            </PageHeader>

            <PageList {...listProps} />
        </Container>
    );
};

PageListPage.displayName = "PageListPage";

export default PageListPage;
