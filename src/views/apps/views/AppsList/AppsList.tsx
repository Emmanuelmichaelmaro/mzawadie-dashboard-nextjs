/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { ListViews } from "@mzawadie/core";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import { AppSortField, AppTypeEnum, JobStatusEnum, OrderDirection } from "@mzawadie/types/globalTypes";
import getAppErrorMessage from "@mzawadie/utils/errors/app";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import AppDeleteDialog from "../../components/AppDeleteDialog";
import AppInProgressDeleteDialog from "../../components/AppInProgressDeleteDialog";
import AppsListPage from "../../components/AppsListPage";
import {
    useAppDeleteFailedInstallationMutation,
    useAppDeleteMutation,
    useAppRetryInstallMutation,
} from "../../mutations";
import { useAppsInProgressListQuery, useAppsListQuery } from "../../queries";
import { AppDelete } from "../../types/AppDelete";
import { AppDeleteFailedInstallation } from "../../types/AppDeleteFailedInstallation";
import { AppsInstallations_appsInstallations } from "../../types/AppsInstallations";
import { AppsList_apps_edges } from "../../types/AppsList";
import {
    AppListUrlDialog,
    AppListUrlQueryParams,
    appSettingsUrl,
    appsListUrl,
    appUrl,
    customAppAddUrl,
    customAppUrl,
} from "../../urls";

const getCurrentAppName = (id: string, collection?: AppsList_apps_edges[]) =>
    collection?.find((edge) => edge.node.id === id)?.node?.name;

const getAppInProgressName = (id: string, collection?: AppsInstallations_appsInstallations[]) =>
    collection?.find((app) => app.id === id)?.appName;
interface AppsListProps {
    params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = ({ params }) => {
    const { action } = params;
    const [activeInstallations, setActiveInstallations] = useLocalStorage("activeInstallations", []);
    const notify = useNotifier();
    const intl = useIntl();
    const navigate = useNavigator();
    const { updateListSettings, settings } = useListSettings(ListViews.APPS_LIST);
    const paginate = usePaginator();
    const paginationState = createPaginationState(settings?.rowNumber, params);
    const queryVariables = {
        sort: {
            direction: OrderDirection.DESC,
            field: AppSortField.CREATION_DATE,
        },
    };
    const intervalId = useRef<null | number>(null);

    const removeInstallation = (id: string) =>
        setActiveInstallations((installations) => installations.filter((item) => item.id !== id));

    const {
        data: appsInProgressData,
        loading: loadingAppsInProgress,
        refetch: appsInProgressRefetch,
    } = useAppsInProgressListQuery({
        displayLoader: false,
    });
    const { data, loading, refetch } = useAppsListQuery({
        displayLoader: true,
        variables: {
            ...paginationState,
            ...queryVariables,
            filter: {
                type: AppTypeEnum.THIRDPARTY,
            },
        },
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        data?.apps?.pageInfo,
        paginationState,
        params
    );

    const {
        data: customAppsData,
        loading: customAppsLoading,
        refetch: customAppsRefetch,
    } = useAppsListQuery({
        displayLoader: true,
        variables: {
            first: 100,
            ...queryVariables,
            filter: {
                type: AppTypeEnum.LOCAL,
            },
        },
    });

    const installedAppNotify = (name: string) => {
        notify({
            status: "success",
            text: intl.formatMessage(
                {
                    defaultMessage: "{name} is ready to be used",
                    id: "ZprV2g",
                    description: "app has been installed",
                },
                { name }
            ),
            title: intl.formatMessage({
                defaultMessage: "App installed",
                id: "0fM/pV",
                description: "message title",
            }),
        });
    };
    const [retryInstallApp] = useAppRetryInstallMutation({
        onCompleted: (data) => {
            const { errors } = data.appRetryInstall;
            if (!errors.length) {
                const { appInstallation } = data.appRetryInstall;
                setActiveInstallations((installations) => [
                    ...installations,
                    { id: appInstallation.id, name: appInstallation.appName },
                ]);
            } else {
                errors.forEach((error) =>
                    notify({ status: "error", text: getAppErrorMessage(error, intl) })
                );
            }
        },
    });
    const [openModal, closeModal] = createDialogActionHandlers<AppListUrlDialog, AppListUrlQueryParams>(
        navigate,
        appsListUrl,
        params
    );

    const onAppRemove = (data: AppDelete) => {
        const { errors } = data.appDelete;
        if (errors.length === 0) {
            if (data.appDelete.app.type === AppTypeEnum.LOCAL) {
                customAppsRefetch();
            } else {
                refetch();
            }
            closeModal();
            removeAppNotify();
        } else {
            errors.forEach((error) =>
                notify({
                    status: "error",
                    text: getAppErrorMessage(error, intl),
                })
            );
        }
    };

    const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
        onCompleted: (data) => {
            onAppRemove(data);
        },
    });
    const [deleteInProgressApp, deleteInProgressAppOpts] = useAppDeleteFailedInstallationMutation({
        onCompleted: (data) => {
            onAppInProgressRemove(data);
        },
    });

    useEffect(() => {
        const appsInProgress = appsInProgressData?.appsInstallations || [];
        if (activeInstallations.length && !!appsInProgressData) {
            if (!intervalId.current) {
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                intervalId.current = window.setInterval(() => appsInProgressRefetch(), 2000);
            }
            activeInstallations.forEach((installation) => {
                const item = appsInProgress?.find((app) => app.id === installation.id);
                if (!item) {
                    removeInstallation(installation.id);
                    installedAppNotify(installation.name);
                    appsInProgressRefetch();
                } else if (item.status === JobStatusEnum.SUCCESS) {
                    removeInstallation(installation.id);
                    installedAppNotify(item.appName);
                    refetch();
                } else if (item.status === JobStatusEnum.FAILED) {
                    removeInstallation(installation.id);
                    notify({
                        status: "error",
                        text: item.message,
                        title: intl.formatMessage(
                            {
                                defaultMessage: "Couldn???t Install {name}",
                                id: "5t/4um",
                                description: "message title",
                            },
                            { name: item.appName }
                        ),
                    });
                }
            });
        }
        if (!activeInstallations.length && intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        };
    }, [activeInstallations.length, appsInProgressData]);

    const handleRemoveInProgressConfirm = () =>
        deleteInProgressApp({
            variables: {
                id: params.id,
            },
        });

    const handleRemoveConfirm = () =>
        deleteApp({
            variables: {
                id: params.id,
            },
        });

    const removeAppNotify = () => {
        notify({
            status: "success",
            text: intl.formatMessage({
                defaultMessage: "App successfully removed",
                id: "uIPD1i",
                description: "app has been removed",
            }),
        });
    };

    const onAppInProgressRemove = (data: AppDeleteFailedInstallation) => {
        const { errors } = data.appDeleteFailedInstallation;
        if (errors.length === 0) {
            removeAppNotify();
            appsInProgressRefetch();
            closeModal();
        } else {
            errors.forEach((error) =>
                notify({
                    status: "error",
                    text: getAppErrorMessage(error, intl),
                })
            );
        }
    };
    const onAppInstallRetry = (id: string) => retryInstallApp({ variables: { id } });

    const installedApps = data?.apps?.edges;
    const customApps = customAppsData?.apps?.edges;

    return (
        <>
            <AppDeleteDialog
                confirmButtonState={deleteAppOpts.status}
                name={getCurrentAppName(
                    params.id,
                    action === "remove-app" ? installedApps : customApps
                )}
                onClose={closeModal}
                onConfirm={handleRemoveConfirm}
                type={action === "remove-app" ? "EXTERNAL" : "CUSTOM"}
                open={action === "remove-app" || action === "remove-custom-app"}
            />
            <AppInProgressDeleteDialog
                confirmButtonState={deleteInProgressAppOpts.status}
                name={getAppInProgressName(params.id, appsInProgressData?.appsInstallations)}
                onClose={closeModal}
                onConfirm={handleRemoveInProgressConfirm}
                open={action === "remove"}
            />
            <AppsListPage
                installedAppsList={installedApps}
                customAppsList={customApps}
                appsInProgressList={appsInProgressData}
                loadingAppsInProgress={loadingAppsInProgress}
                disabled={loading || customAppsLoading}
                settings={settings}
                pageInfo={pageInfo}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onUpdateListSettings={updateListSettings}
                onRowClick={(id) => () => navigate(appUrl(id))}
                onSettingsRowClick={(id) => () => navigate(appSettingsUrl(id))}
                onAppInstallRetry={onAppInstallRetry}
                navigateToCustomApp={(id) => () => navigate(customAppUrl(id))}
                navigateToCustomAppCreate={() => navigate(customAppAddUrl)}
                onInstalledAppRemove={(id) =>
                    openModal("remove-app", {
                        id,
                    })
                }
                onCustomAppRemove={(id) =>
                    openModal("remove-custom-app", {
                        id,
                    })
                }
                onAppInProgressRemove={(id) =>
                    openModal("remove", {
                        id,
                    })
                }
            />
        </>
    );
};

export default AppsList;
