import { Backlink } from "@mzawadie/components/Backlink";
import { Button } from "@mzawadie/components/Button";
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { sectionNames } from "@mzawadie/core";
import { ListActions, PageListProps, SortPage } from "@mzawadie/core";
import { MenuFragment } from "@mzawadie/graphql";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { menuListUrl, MenuListUrlSortField } from "@mzawadie/pages/navigation/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuList } from "../MenuList";

export interface MenuListPageProps extends PageListProps, ListActions, SortPage<MenuListUrlSortField> {
    menus: MenuFragment[];
    onDelete: (id: string) => void;
}

const MenuListPage: React.FC<MenuListPageProps> = ({ ...listProps }) => {
    const intl = useIntl();

    const addUrl = menuListUrl({
        action: "add",
    });

    return (
        <Container>
            <Backlink href={configurationMenuUrl}>
                {intl.formatMessage(sectionNames.configuration)}
            </Backlink>

            <PageHeader title={intl.formatMessage(sectionNames.navigation)}>
                <Button variant="primary" href={addUrl} data-test-id="add-menu">
                    <FormattedMessage id="JXRYQg" defaultMessage="Create Menu" description="button" />
                </Button>
            </PageHeader>

            <MenuList {...listProps} />
        </Container>
    );
};

MenuListPage.displayName = "MenuListPage";

export default MenuListPage;
