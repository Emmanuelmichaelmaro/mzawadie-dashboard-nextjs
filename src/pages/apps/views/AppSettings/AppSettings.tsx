// @ts-nocheck
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { appMessages } from "@mzawadie/pages/apps/messages";
import React from "react";
import { useIntl } from "react-intl";

import { AppPage } from "../../components/AppPage";
import { useAppDetails } from "../../queries";
import { appDetailsUrl, appsListPath } from "../../urls";

interface AppSettingsProps {
    id: string;
}

export const AppSettings: React.FC<AppSettingsProps> = ({ id }) => {
    const { data } = useAppDetails({
        displayLoader: true,
        variables: { id },
    });

    const appExists = data?.app !== null;

    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    if (!appExists) {
        return <NotFoundPage onBack={() => navigate(appsListPath)} />;
    }

    return (
        <AppPage
            data={data?.app}
            url={data?.app?.configurationUrl}
            navigateToAbout={() => navigate(appDetailsUrl(id))}
            onBack={() => navigate(appsListPath)}
            onError={() =>
                notify({
                    status: "error",
                    text: intl.formatMessage(appMessages.failedToFetchAppSettings),
                })
            }
        />
    );
};

export default AppSettings;
