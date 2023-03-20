import { MetadataInput } from "@mzawadie/graphql";

export const filterMetadataArray = (metadataInputs: MetadataInput[]) =>
    metadataInputs.filter((input) => !!input.key);
