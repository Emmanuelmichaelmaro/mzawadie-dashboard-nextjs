// @ts-nocheck
import {
    listActionsProps,
    pageListProps,
    searchPageProps,
    sortPageProps,
    tabPageProps,
} from "@mzawadie/core";
import { storiesOf } from "@storybook/react";
import React from "react";

import { Decorator } from "../../../../../.storybook/decorators";
import { appsInProgress, appsList, customAppsList } from "../../fixtures";
import AppsListPage, { AppsListPageProps } from "./AppsListPage";

const props: AppsListPageProps = {
    ...listActionsProps,
    ...pageListProps.default,
    ...searchPageProps,
    ...sortPageProps,
    ...tabPageProps,
    appsInProgressList: { appsInstallations: appsInProgress },
    customAppsList,
    disabled: false,
    installedAppsList: appsList,
    loadingAppsInProgress: false,
    navigateToCustomApp: () => undefined,
    navigateToCustomAppCreate: () => undefined,
    onAppInProgressRemove: () => undefined,
    onAppInstallRetry: () => undefined,
    onCustomAppRemove: () => undefined,
    onInstalledAppRemove: () => undefined,
    onNextPage: () => undefined,
    onPreviousPage: () => undefined,
    onRowClick: () => undefined,
    onSettingsRowClick: () => undefined,
};

storiesOf("Views / Apps / Apps list", module)
    .addDecorator(Decorator)
    .add("default", () => <AppsListPage {...props} />)
    .add("loading", () => (
        <AppsListPage
            {...props}
            appsInProgressList={undefined}
            disabled
            loadingAppsInProgress
            installedAppsList={undefined}
            customAppsList={undefined}
        />
    ))
    .add("no data", () => (
        <AppsListPage
            {...props}
            appsInProgressList={undefined}
            installedAppsList={[]}
            customAppsList={[]}
        />
    ));
