// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { extractMutationErrors } from "@mzawadie/core";
import { useAppFetchMutation, useAppInstallMutation } from "@mzawadie/graphql";
import useLocalStorage from "@mzawadie/hooks/useLocalStorage";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import getAppErrorMessage from "@mzawadie/utils/errors/app";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps } from "react-router-dom";

import { AppInstallErrorPage } from "../../components/AppInstallErrorPage";
import { AppInstallPage } from "../../components/AppInstallPage";
import { AppInstallUrlQueryParams, appsListUrl, MANIFEST_ATTR } from "../../urls";
import { messages } from "./messages";

interface InstallAppCreateProps extends RouteComponentProps {
    params: AppInstallUrlQueryParams;
}

export const InstallAppCreate: React.FC<InstallAppCreateProps> = ({ params }) => {
    const [, setActiveInstallations] = useLocalStorage("activeInstallations", []);
    
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    
    const manifestUrl = params[MANIFEST_ATTR];

    const [fetchManifest, fetchManifestOpts] = useAppFetchMutation({
        onCompleted: (data) => {
            if (data.appFetchManifest?.errors.length) {
                data.appFetchManifest.errors.forEach((error) => {
                    notify({
                        status: "error",
                        text: getAppErrorMessage(error, intl),
                    });
                });
            }
        },
    });
    
    const [installApp] = useAppInstallMutation({
        onCompleted: (data) => {
            const installationData = data.appInstall?.appInstallation;
    
            if (data.appInstall?.errors.length === 0) {
                setActiveInstallations((activeInstallations) => [
                    ...activeInstallations,
                    { id: installationData.id, name: installationData.appName },
                ]);
                navigateToAppsList();
            } else {
                data.appInstall?.errors.forEach((error) => {
                    notify({
                        status: "error",
                        text: getAppErrorMessage(error, intl),
                    });
                });
            }
        },
    });

    const navigateToAppsList = () => navigate(appsListUrl());

    const handleSubmit = () => {
        const manifest = fetchManifestOpts?.data?.appFetchManifest?.manifest;

        return extractMutationErrors(
            installApp({
                variables: {
                    input: {
                        appName: manifest?.name,
                        manifestUrl,
                        permissions: manifest?.permissions?.map((permission) => permission?.code),
                    },
                },
            })
        );
    };

    useEffect(() => {
        if (manifestUrl) {
            fetchManifest({ variables: { manifestUrl } });
        } else {
            navigate(appsListUrl());
        }
    }, []);

    return (
        <>
            <WindowTitle title={intl.formatMessage(messages.installApp)} />

            {!!fetchManifestOpts.data?.appFetchManifest?.errors?.length || !!fetchManifestOpts.error ? (
                <AppInstallErrorPage onBack={() => navigate("/")} />
            ) : (
                <AppInstallPage
                    data={fetchManifestOpts?.data?.appFetchManifest?.manifest}
                    navigateToAppsList={navigateToAppsList}
                    onSubmit={handleSubmit}
                    loading={fetchManifestOpts?.loading}
                />
            )}
        </>
    );
};

export default InstallAppCreate;
