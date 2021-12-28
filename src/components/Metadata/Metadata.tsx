// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ChangeEvent } from "@mzawadie/hooks/useForm";
import { MetadataInput } from "@mzawadie/types/globalTypes";
import { removeAtIndex, updateAtIndex } from "@mzawadie/utils/lists";
import React from "react";

import CardSpacer from "../CardSpacer";
import MetadataCard, { MetadataCardProps } from "./MetadataCard";
import { EventDataAction, EventDataField } from "./types";
import { getDataKey, parseEventData } from "./utils";

export interface MetadataProps extends Omit<MetadataCardProps, "data" | "isPrivate"> {
    data: Record<"metadata" | "privateMetadata", MetadataInput[]>;
}

const Metadata: React.FC<MetadataProps> = ({ data, onChange }) => {
    const change = (event: ChangeEvent, isPrivate: boolean) => {
        const { action, field, fieldIndex, value } = parseEventData(event);
        const key = getDataKey(isPrivate);
        const dataToUpdate = data[key];

        onChange({
            target: {
                name: key,
                value:
                    action === EventDataAction.update
                        ? updateAtIndex(
                              {
                                  ...dataToUpdate[fieldIndex],
                                  key:
                                      field === EventDataField.name
                                          ? value
                                          : dataToUpdate[fieldIndex].key,
                                  value:
                                      field === EventDataField.value
                                          ? value
                                          : dataToUpdate[fieldIndex].value,
                              },
                              dataToUpdate,
                              fieldIndex
                          )
                        : action === EventDataAction.add
                        ? [
                              ...dataToUpdate,
                              {
                                  key: "",
                                  value: "",
                              },
                          ]
                        : removeAtIndex(dataToUpdate, fieldIndex),
            },
        });
    };

    return (
        <>
            <MetadataCard
                data={data?.metadata}
                isPrivate={false}
                onChange={(event) => change(event, false)}
            />

            <CardSpacer />

            <MetadataCard
                data={data?.privateMetadata}
                isPrivate
                onChange={(event) => change(event, true)}
            />
        </>
    );
};

Metadata.displayName = "Metadata";

export default Metadata;
