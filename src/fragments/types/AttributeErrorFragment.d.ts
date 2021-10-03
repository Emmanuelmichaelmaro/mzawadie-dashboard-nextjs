import { AttributeErrorCode } from "./../../types/globalTypes";
export interface AttributeErrorFragment {
    __typename: "AttributeError";
    code: AttributeErrorCode;
    field: string | null;
}
