// @ts-nocheck
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { sectionNames, ListProps } from "@mzawadie/core";
import { AppsInstallationsQuery, AppsListQuery } from "@mzawadie/graphql";
import React from "react";
import { useIntl } from "react-intl";

import AppsInProgress from "../AppsInProgress/AppsInProgress";
import CustomApps from "../CustomApps/CustomApps";
import InstalledApps from "../InstalledApps/InstalledApps";
import Marketplace from "../Marketplace/Marketplace";

export interface AppsListPageProps extends ListProps {
    installedAppsList: AppsListQuery["apps"]["edges"];
    customAppsList: AppsListQuery["apps"]["edges"];
    appsInProgressList?: AppsInstallationsQuery;
    loadingAppsInProgress: boolean;
    navigateToCustomApp: (id: string) => () => void;
    navigateToCustomAppCreate: () => void;
    onInstalledAppRemove: (id: string) => void;
    onCustomAppRemove: (id: string) => void;
    onAppInProgressRemove: (id: string) => void;
    onAppInstallRetry: (id: string) => void;
    onRowAboutClick: (id: string) => () => void;
}

const AppsListPage: React.FC<AppsListPageProps> = ({
    appsInProgressList,
    customAppsList,
    installedAppsList,
    loadingAppsInProgress,
    navigateToCustomApp,
    navigateToCustomAppCreate,
    onInstalledAppRemove,
    onCustomAppRemove,
    onAppInProgressRemove,
    onAppInstallRetry,
    onRowAboutClick,
    ...listProps
}) => {
    const intl = useIntl();

    const appsInProgress = appsInProgressList?.appsInstallations;

    return (
        <Container>
            <PageHeader title={intl.formatMessage(sectionNames.apps)} />

            {!!appsInProgress?.length && (
                <>
                    <AppsInProgress
                        appsList={appsInProgress}
                        disabled={loadingAppsInProgress}
                        onAppInstallRetry={onAppInstallRetry}
                        onRemove={onAppInProgressRemove}
                    />
                    <CardSpacer />
                </>
            )}

            <InstalledApps
                appsList={installedAppsList}
                onRemove={onInstalledAppRemove}
                onRowAboutClick={onRowAboutClick}
                {...listProps}
            />

            <CardSpacer />

            <CustomApps
                appsList={customAppsList}
                navigateToCustomApp={navigateToCustomApp}
                navigateToCustomAppCreate={navigateToCustomAppCreate}
                onRemove={onCustomAppRemove}
            />

            <CardSpacer />

            <Marketplace />
        </Container>
    );
};

AppsListPage.displayName = "AppsListPage";

export default AppsListPage;
