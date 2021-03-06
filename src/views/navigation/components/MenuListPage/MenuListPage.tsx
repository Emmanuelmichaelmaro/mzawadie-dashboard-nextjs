import { Button } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import PageHeader from "@mzawadie/components/PageHeader";
import { sectionNames, ListActions, PageListProps, SortPage } from "@mzawadie/core";
import { MenuListUrlSortField } from "@mzawadie/views/navigation/urls";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { MenuList_menus_edges_node } from "../../types/MenuList";
import MenuList from "../MenuList";

export interface MenuListPageProps extends PageListProps, ListActions, SortPage<MenuListUrlSortField> {
    menus: MenuList_menus_edges_node[];
    onBack: () => void;
    onDelete: (id: string) => void;
}

const MenuListPage: React.FC<MenuListPageProps> = ({ onAdd, onBack, ...listProps }) => {
    const intl = useIntl();
    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>
            <PageHeader title={intl.formatMessage(sectionNames.navigation)}>
                <Button color="primary" variant="contained" onClick={onAdd} data-test-id="addMenu">
                    <FormattedMessage defaultMessage="Create Menu" description="button" id="JXRYQg" />
                </Button>
            </PageHeader>
            <MenuList {...listProps} />
        </Container>
    );
};

MenuListPage.displayName = "MenuListPage";

export default MenuListPage;
