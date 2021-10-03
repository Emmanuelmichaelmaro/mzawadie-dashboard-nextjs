import { ExportErrorCode } from "./../../types/globalTypes";
export interface ExportErrorFragment {
    __typename: "ExportError";
    code: ExportErrorCode;
    field: string | null;
}
