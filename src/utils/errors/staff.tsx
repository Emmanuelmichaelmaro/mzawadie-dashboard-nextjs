import { StaffErrorFragment } from "@mzawadie/graphql";
import { IntlShape } from "react-intl";

import getAccountErrorMessage from "./account";

function getStaffErrorMessage(err: StaffErrorFragment, intl: IntlShape): string {
    return getAccountErrorMessage(
        err && {
            ...err,
            __typename: "AccountError",
            addressType: null,
        },
        intl
    ) as string;
}

export default getStaffErrorMessage;
