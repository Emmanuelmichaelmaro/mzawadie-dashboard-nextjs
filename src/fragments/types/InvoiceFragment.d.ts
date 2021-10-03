import { JobStatusEnum } from "./../../types/globalTypes";
export interface InvoiceFragment {
    __typename: "Invoice";
    id: string;
    number: string | null;
    createdAt: any;
    url: string | null;
    status: JobStatusEnum;
}
