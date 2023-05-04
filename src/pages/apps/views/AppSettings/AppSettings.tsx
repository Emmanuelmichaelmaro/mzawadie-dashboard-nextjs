// @ts-nocheck
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { useAppQuery } from "@mzawadie/graphql";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { appMessages } from "@mzawadie/pages/apps/messages";
import React from "react";
import { useIntl } from "react-intl";

import { AppPage } from "../../components/AppPage";
import { appDetailsUrl, appsListPath } from "../../urls";

interface AppSettingsProps {
    id: string;
}

export const AppSettings: React.FC<AppSettingsProps> = ({ id }) => {
    const { data, refetch } = useAppQuery({
        displayLoader: true,
        variables: { id },
    });

    const appExists = data?.app !== null;

    const notify = useNotifier();

    const intl = useIntl();

    if (!appExists) {
        return <NotFoundPage backHref={appsListPath} />;
    }

    return (
        <AppPage
            data={data?.app}
            url={data?.app?.configurationUrl}
            aboutHref={appDetailsUrl(id)}
            refetch={refetch}
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
