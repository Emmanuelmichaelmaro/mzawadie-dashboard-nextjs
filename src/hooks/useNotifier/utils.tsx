import { IntlShape } from "react-intl"

import { IMessage } from "../../components/messages"
import { commonMessages } from "../../intl"
import commonErrorMessages from "../../utils/errors/common"

export const getDefaultNotifierSuccessErrorData = (
    errors: any[],
    intl: IntlShape
): IMessage =>
    errors.length === 0
        ? {
              status: "success",
              text: intl.formatMessage(commonMessages.savedChanges),
          }
        : {
              status: "error",
              text: intl.formatMessage(commonErrorMessages.unknownError),
          }
