import { JobStatusEnum } from "./../../../types/globalTypes";
export interface CheckExportFileStatus_exportFile {
    __typename: "ExportFile";
    id: string;
    status: JobStatusEnum;
}
export interface CheckExportFileStatus {
    exportFile: CheckExportFileStatus_exportFile | null;
}
export interface CheckExportFileStatusVariables {
    id: string;
}
