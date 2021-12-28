import { Button, Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import PageHeader from "@mzawadie/components/PageHeader";
import { sectionNames, PageListProps, SortPage } from "@mzawadie/core";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PermissionGroupList_permissionGroups_edges_node } from "../../types/PermissionGroupList";
import { PermissionGroupListUrlSortField } from "../../urls";
import PermissionGroupList from "../PermissionGroupList";

export interface PermissionGroupListPageProps
    extends PageListProps,
        SortPage<PermissionGroupListUrlSortField> {
    permissionGroups: PermissionGroupList_permissionGroups_edges_node[];
    onBack: () => void;
    onDelete: (id: string) => void;
    onRowClick: (id: string) => () => void;
}

const PermissionGroupListPage: React.FC<PermissionGroupListPageProps> = ({
    onAdd,
    onBack,
    ...listProps
}) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>
            <PageHeader title={intl.formatMessage(sectionNames.permissionGroups)}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onAdd}
                    data-test-id="createPermissionGroup"
                >
                    <FormattedMessage
                        defaultMessage="create permission group"
                        id="5ftg/B"
                        description="button"
                    />
                </Button>
            </PageHeader>
            <Card>
                <PermissionGroupList {...listProps} />
            </Card>
        </Container>
    );
};

PermissionGroupListPage.displayName = "PermissionGroupListPage";

export default PermissionGroupListPage;
