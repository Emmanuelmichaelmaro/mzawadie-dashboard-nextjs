import { commonMessages } from "@mzawadie/core";
import { MenuErrorFragment } from "@mzawadie/fragments/types/MenuErrorFragment";
import { MenuErrorCode } from "@mzawadie/types/globalTypes";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getMenuErrorMessage(
    err: Omit<MenuErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        switch (err.code) {
            case MenuErrorCode.GRAPHQL_ERROR:
                return intl.formatMessage(commonErrorMessages.graphqlError);
            case MenuErrorCode.REQUIRED:
                return intl.formatMessage(commonMessages.requiredField);
            case MenuErrorCode.INVALID:
                return intl.formatMessage(commonErrorMessages.invalid);
            default:
                return intl.formatMessage(commonErrorMessages.unknownError);
        }
    }

    return undefined;
}

export default getMenuErrorMessage;
