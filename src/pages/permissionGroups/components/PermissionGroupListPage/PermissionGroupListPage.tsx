// @ts-nocheck
import { Card } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { sectionNames } from "@mzawadie/core";
import { PageListProps, SortPage } from "@mzawadie/core";
import { PermissionGroupFragment } from "@mzawadie/graphql";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { permissionGroupAddUrl, PermissionGroupListUrlSortField } from "../../urls";
import { PermissionGroupList } from "../PermissionGroupList";

export interface PermissionGroupListPageProps
    extends PageListProps,
        SortPage<PermissionGroupListUrlSortField> {
    permissionGroups: PermissionGroupFragment[];
    onDelete: (id: string) => void;
}

const PermissionGroupListPage: React.FC<PermissionGroupListPageProps> = (listProps) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink href={configurationMenuUrl}>
                {intl.formatMessage(sectionNames.configuration)}
            </Backlink>

            <PageHeader title={intl.formatMessage(sectionNames.permissionGroups)}>
                <Button
                    variant="primary"
                    href={permissionGroupAddUrl}
                    data-test-id="create-permission-group"
                >
                    <FormattedMessage
                        id="bRJD/v"
                        defaultMessage="Create permission group"
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
