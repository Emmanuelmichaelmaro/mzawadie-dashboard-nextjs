import { CardMenu, CardMenuItem } from "@mzawadie/components/CardMenu";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { sectionNames } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { HorizontalSpacer } from "@mzawadie/pages/apps/components/HorizontalSpacer";
import { useGiftCardListDialogs } from "@mzawadie/pages/giftCards/components/GiftCardsList/providers/GiftCardListDialogsProvider";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import GiftCardsListHeaderAlert from "./GiftCardsListHeaderAlert";

const GiftCardsListHeader: React.FC = () => {
    const intl = useIntl();
    const navigate = useNavigator();

    const { openCreateDialog, openBulkCreateDialog, openExportDialog } = useGiftCardListDialogs();

    const openSettings = () => navigate(giftCardSettingsUrl);

    const menuItems: CardMenuItem[] = [
        {
            label: intl.formatMessage(messages.settings),
            testId: "settingsMenuItem",
            onSelect: openSettings,
        },
        {
            label: intl.formatMessage(messages.bulkIssue),
            testId: "bulkIssueMenuItem",
            onSelect: openBulkCreateDialog,
        },
        {
            label: intl.formatMessage(messages.exportCodes),
            testId: "exportCodesMenuItem",
            onSelect: openExportDialog,
        },
    ];

    return (
        <>
            <PageHeader
                preview
                title={intl.formatMessage(sectionNames.giftCards)}
                cardMenu={<CardMenu menuItems={menuItems} data-test-id="menu" />}
            >
                <HorizontalSpacer spacing={2} />
                <Button variant="primary" onClick={openCreateDialog} data-test-id="issue-card-button">
                    {intl.formatMessage(messages.issueButtonLabel)}
                </Button>
            </PageHeader>
            <GiftCardsListHeaderAlert />
        </>
    );
};

export default GiftCardsListHeader;
