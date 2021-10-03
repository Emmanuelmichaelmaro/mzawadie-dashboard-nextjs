import * as Sentry from "@sentry/react";

import { TrackerMethods } from "../types";

interface Config {
    dsn: string | undefined;
    environment?: string;
}

// eslint-disable-next-line import/prefer-default-export
export const SentryAdapter = (config: Config): TrackerMethods => {
    const init: TrackerMethods["init"] = () => {
        if (config?.dsn) {
            Sentry.init({
                dsn: config.dsn,
                environment: config.environment,
                ignoreErrors: ["Editor's content can not be saved in read-only mode"],
            });
            return true;
        }
        return false;
    };

    const setUserData: TrackerMethods["setUserData"] = (userData) => Sentry.setUser(userData);

    const captureException: TrackerMethods["captureException"] = (e: Error) =>
        Sentry.captureException(e);

    return {
        captureException,
        init,
        setUserData,
    };
};
