import { IMessage } from "@mzawadie/components/Messages";
import { commonMessages } from "@mzawadie/core";
import commonErrorMessages from "@mzawadie/utils/errors/common";
import { IntlShape } from "react-intl";

export const getDefaultNotifierSuccessErrorData = (errors: any[], intl: IntlShape): IMessage =>
    !errors.length
        ? {
              status: "success",
              text: intl.formatMessage(commonMessages.savedChanges),
          }
        : {
              status: "error",
              text: intl.formatMessage(commonErrorMessages.unknownError),
          };
