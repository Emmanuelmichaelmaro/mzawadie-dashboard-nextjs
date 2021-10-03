import { JobStatusEnum } from "./../../types/globalTypes";
export interface ExportFileFragment {
    __typename: "ExportFile";
    id: string;
    status: JobStatusEnum;
    url: string | null;
}
