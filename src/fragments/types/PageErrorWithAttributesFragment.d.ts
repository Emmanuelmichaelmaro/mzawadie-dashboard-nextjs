import { PageErrorCode } from "./../../types/globalTypes";
export interface PageErrorWithAttributesFragment {
    __typename: "PageError";
    code: PageErrorCode;
    field: string | null;
    attributes: string[] | null;
}
