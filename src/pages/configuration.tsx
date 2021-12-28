import AppLayout from "@mzawadie/components/AppLayout";
import { useAuth } from "@mzawadie/sdk/lib/src";
import { hasPermission } from "@mzawadie/views/auth/misc";
import ConfigurationSection, { createConfigurationMenu } from "@mzawadie/views/configuration";
import React from "react";
import { useIntl } from "react-intl";

const ConfigurationPage: React.FC<{}> = () => {
    const intl = useIntl();
    const { user } = useAuth();

    return (
        <>
            {user &&
                createConfigurationMenu(intl).filter((menu) =>
                    menu.menuItems.map((item) => hasPermission(item.permission, user))
                ).length > 0 && <ConfigurationSection />}
        </>
    );
};

// @ts-ignore
ConfigurationPage.layout = AppLayout;

export default ConfigurationPage;
