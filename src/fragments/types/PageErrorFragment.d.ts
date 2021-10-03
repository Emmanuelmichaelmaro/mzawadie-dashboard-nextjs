import { PageErrorCode } from "./../../types/globalTypes";
export interface PageErrorFragment {
    __typename: "PageError";
    code: PageErrorCode;
    field: string | null;
}
