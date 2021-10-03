import { AccountErrorCode } from "./../../types/globalTypes";
export interface StaffErrorFragment {
    __typename: "StaffError";
    code: AccountErrorCode;
    field: string | null;
}
