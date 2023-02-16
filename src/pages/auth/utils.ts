import { ApolloError } from "@apollo/client";
import { IMessageContext } from "@mzawadie/components/Messages";
import { commonMessages } from "@mzawadie/core";
import { UseNotifierResult } from "@mzawadie/hooks/useNotifier";
import { IntlShape } from "react-intl";

import { isJwtError, isTokenExpired } from "./errors";

export const displayDemoMessage = (intl: IntlShape, notify: UseNotifierResult) => {
    notify({
        text: intl.formatMessage(commonMessages.demo),
    });
};

// eslint-disable-next-line @typescript-eslint/require-await
export async function handleQueryAuthError(
    error: ApolloError,
    notify: IMessageContext,
    logout: () => void,
    intl: IntlShape
) {
    if (error.graphQLErrors.some(isJwtError)) {
        logout();
        if (error.graphQLErrors.every(isTokenExpired)) {
            notify({
                status: "error",
                text: intl.formatMessage(commonMessages.sessionExpired),
            });
        } else {
            notify({
                status: "error",
                text: intl.formatMessage(commonMessages.somethingWentWrong),
            });
        }
    } else if (
        !error.graphQLErrors.every((err) => err.extensions?.exception?.code === "PermissionDenied")
    ) {
        notify({
            status: "error",
            text: intl.formatMessage(commonMessages.somethingWentWrong),
        });
    }
}
