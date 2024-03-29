import { commonMessages } from "@mzawadie/core";
import { ExportErrorFragment, ExportErrorCode } from "@mzawadie/graphql";
import { IntlShape } from "react-intl";

import commonErrorMessages from "./common";

function getExportErrorMessage(
    err: Omit<ExportErrorFragment, "__typename"> | undefined,
    intl: IntlShape
): string | undefined {
    if (err) {
        if (err.code === ExportErrorCode.REQUIRED) {
            return intl.formatMessage(commonMessages.requiredField);
        }
        return intl.formatMessage(commonErrorMessages.unknownError);
    }

    return undefined;
}

export default getExportErrorMessage;
