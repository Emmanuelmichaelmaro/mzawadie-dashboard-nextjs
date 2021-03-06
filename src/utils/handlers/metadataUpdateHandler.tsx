import { FetchResult } from "@apollo/client";
import { MetadataFormData } from "@mzawadie/components/Metadata/types";
import { MetadataErrorFragment } from "@mzawadie/fragments/types/MetadataErrorFragment";
import { MetadataInput } from "@mzawadie/types/globalTypes";
import { arrayDiff } from "@mzawadie/utils/arrays";

import { UpdateMetadata, UpdateMetadataVariables } from "../metadata/types/UpdateMetadata";
import {
    UpdatePrivateMetadata,
    UpdatePrivateMetadataVariables,
} from "../metadata/types/UpdatePrivateMetadata";

interface ObjectWithMetadata {
    id: string;
    metadata: MetadataInput[];
    privateMetadata: MetadataInput[];
}

function createMetadataUpdateHandler<TData extends MetadataFormData, TError>(
    initial: ObjectWithMetadata,
    update: (data: TData) => Promise<TError[]>,
    updateMetadata: (variables: UpdateMetadataVariables) => Promise<FetchResult<UpdateMetadata>>,
    updatePrivateMetadata: (
        variables: UpdatePrivateMetadataVariables
    ) => Promise<FetchResult<UpdatePrivateMetadata>>
) {
    return async (data: TData): Promise<Array<MetadataErrorFragment | TError>> => {
        const errors = await update(data);

        if (errors.length > 0) {
            return errors;
        }

        if (errors.length === 0) {
            if (data.metadata) {
                const initialKeys = initial.metadata.map((m) => m.key);
                const modifiedKeys = data.metadata.map((m) => m.key);

                const keyDiff = arrayDiff(initialKeys, modifiedKeys);

                const updateMetaResult = await updateMetadata({
                    id: initial.id,
                    input: data.metadata,
                    keysToDelete: keyDiff.removed,
                });
                const updateMetaErrors = [
                    ...(updateMetaResult?.data?.deleteMetadata?.errors || []),
                    ...(updateMetaResult?.data?.updateMetadata?.errors || []),
                ];

                if (updateMetaErrors.length > 0) {
                    return updateMetaErrors;
                }
            }

            if (data.privateMetadata) {
                const initialKeys = initial.privateMetadata.map((m) => m.key);
                const modifiedKeys = data.privateMetadata.map((m) => m.key);

                const keyDiff = arrayDiff(initialKeys, modifiedKeys);

                const updatePrivateMetaResult = await updatePrivateMetadata({
                    id: initial.id,
                    input: data.privateMetadata,
                    keysToDelete: keyDiff.removed,
                });

                const updatePrivateMetaErrors = [
                    ...(updatePrivateMetaResult.data?.deletePrivateMetadata?.errors || []),
                    ...(updatePrivateMetaResult.data?.updatePrivateMetadata?.errors || []),
                ];

                if (updatePrivateMetaErrors.length > 0) {
                    return updatePrivateMetaErrors;
                }
            }
        }

        return [];
    };
}

export default createMetadataUpdateHandler;
