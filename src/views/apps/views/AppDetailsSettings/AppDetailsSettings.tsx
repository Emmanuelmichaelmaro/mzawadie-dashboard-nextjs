// @ts-nocheck
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import React from "react";
import { useIntl } from "react-intl";

import AppDetailsSettingsPage from "../../components/AppDetailsSettingsPage";
import { useAppDetails } from "../../queries";
import { appsListPath, appUrl } from "../../urls";

interface AppDetailsSetttingsProps {
    id: string;
}

export const AppDetailsSettings: React.FC<AppDetailsSetttingsProps> = ({ id }) => {
    const shop = useShop();
    const { data } = useAppDetails({
        displayLoader: true,
        variables: { id },
    });
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();

    return (
        <AppDetailsSettingsPage
            backendHost={shop?.domain.host}
            data={data?.app}
            navigateToDashboard={() => navigate(appUrl(id))}
            onBack={() => navigate(appsListPath)}
            onError={() =>
                notify({
                    status: "error",
                    text: intl.formatMessage({
                        defaultMessage: "Failed to fetch app settings",
                        id: "ac+Y98",
                        description: "app settings error",
                    }),
                })
            }
        />
    );
};

export default AppDetailsSettings;
