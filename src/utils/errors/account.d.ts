import { AccountErrorFragment } from "@mzawadie/fragments/types/AccountErrorFragment";
import { IntlShape } from "react-intl";
declare function getAccountErrorMessage(err: AccountErrorFragment, intl: IntlShape): string | undefined;
export default getAccountErrorMessage;
