import { MetadataErrorCode } from "./../../types/globalTypes";
export interface MetadataErrorFragment {
    __typename: "MetadataError";
    code: MetadataErrorCode;
    field: string | null;
}
