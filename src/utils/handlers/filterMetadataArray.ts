import { MetadataInput } from "@mzawadie/types/globalTypes";

export const filterMetadataArray = (metadataInputs: MetadataInput[]) =>
    metadataInputs.filter((input) => !!input.key);
