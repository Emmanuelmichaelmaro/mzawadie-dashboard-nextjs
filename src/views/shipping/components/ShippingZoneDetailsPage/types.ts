import { MetadataFormData } from "@mzawadie/components/Metadata";

export interface FormData extends MetadataFormData {
    name: string;
    description: string;
    warehouses: string[];
    channels: string[];
}
