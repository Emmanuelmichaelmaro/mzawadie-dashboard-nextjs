import { InvoiceErrorCode } from "./../../types/globalTypes";
export interface InvoiceErrorFragment {
    __typename: "InvoiceError";
    code: InvoiceErrorCode;
    field: string | null;
}
