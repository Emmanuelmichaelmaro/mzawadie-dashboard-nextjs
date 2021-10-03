import { UploadErrorCode } from "./../../types/globalTypes";
export interface UploadErrorFragment {
    __typename: "UploadError";
    code: UploadErrorCode;
    field: string | null;
}
