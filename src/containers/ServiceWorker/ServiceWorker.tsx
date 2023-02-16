/* eslint-disable @typescript-eslint/unbound-method */
import { SW_INTERVAL } from "@mzawadie/core";
import { useNotifier, useServiceWorker } from "@mzawadie/hooks";
import React from "react";
import { useIntl } from "react-intl";

import messages from "./messages";

const ServiceWorker: React.FC = () => {
    const { update, updateAvailable } = useServiceWorker(SW_INTERVAL * 1000);
    const notify = useNotifier();
    const { formatMessage } = useIntl();

    React.useEffect(() => {
        if (updateAvailable) {
            notify({
                title: formatMessage(messages.newVersionTitle),
                text: formatMessage(messages.newVersionContent),
                actionBtn: {
                    label: formatMessage(messages.refresh),
                    action: update,
                },
                autoHide: null,
                status: "warning",
            });
        }
    }, [updateAvailable]);

    return null;
};

export default ServiceWorker;
