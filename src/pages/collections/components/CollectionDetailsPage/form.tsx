// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { useExitFormDialog } from "@mzawadie/components/Form/useExitFormDialog";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import useForm, { CommonUseFormResultWithHandlers, FormChange } from "@mzawadie/hooks/useForm";
import useHandleFormSubmit from "@mzawadie/hooks/useHandleFormSubmit";
import { ChannelCollectionData } from "@mzawadie/pages/channels/utils";
import { CollectionDetails_collection } from "@mzawadie/pages/collections/types/CollectionDetails";
import { createChannelsChangeHandler } from "@mzawadie/pages/collections/utils";
import { COLLECTION_DETAILS_FORM_ID } from "@mzawadie/pages/collections/views/consts";
import { mapMetadataItemToInput } from "@mzawadie/utils/maps";
import getMetadata from "@mzawadie/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@mzawadie/utils/richText/useRichText";
import React, { useEffect } from "react";

export interface CollectionUpdateFormData extends MetadataFormData {
    backgroundImageAlt: string;
    channelListings: ChannelCollectionData[];
    name: string;
    slug: string;
    seoDescription: string;
    seoTitle: string;
}
export interface CollectionUpdateData extends CollectionUpdateFormData {
    description: OutputData;
}

interface CollectionUpdateHandlers {
    changeMetadata: FormChange;
    changeDescription: RichTextEditorChange;
    changeChannels: (id: string, data: Omit<ChannelCollectionData, "name" | "id">) => void;
}
export type UseCollectionUpdateFormResult = CommonUseFormResultWithHandlers<
    CollectionUpdateData,
    CollectionUpdateHandlers
>;

export interface CollectionUpdateFormProps {
    children: (props: UseCollectionUpdateFormResult) => React.ReactNode;
    collection: CollectionDetails_collection;
    currentChannels: ChannelCollectionData[];
    setChannels: (data: ChannelCollectionData[]) => void;
    onSubmit: (data: CollectionUpdateData) => Promise<any[]>;
}

const getInitialData = (
    collection: CollectionDetails_collection,
    currentChannels: ChannelCollectionData[]
): CollectionUpdateFormData => ({
    backgroundImageAlt: collection?.backgroundImage?.alt || "",
    channelListings: currentChannels,
    metadata: collection?.metadata?.map(mapMetadataItemToInput),
    name: collection?.name || "",
    privateMetadata: collection?.privateMetadata?.map(mapMetadataItemToInput),
    seoDescription: collection?.seoDescription || "",
    seoTitle: collection?.seoTitle || "",
    slug: collection?.slug || "",
});

function useCollectionUpdateForm(
    collection: CollectionDetails_collection,
    currentChannels: ChannelCollectionData[],
    setChannels: (data: ChannelCollectionData[]) => void,
    onSubmit: (data: CollectionUpdateData) => Promise<any[]>
): UseCollectionUpdateFormResult {
    const {
        handleChange,
        data: formData,
        triggerChange,
        setChanged,
        hasChanged,
        formId,
    } = useForm(getInitialData(collection, currentChannels), undefined, {
        confirmLeave: true,
        formId: COLLECTION_DETAILS_FORM_ID,
    });

    const handleFormSubmit = useHandleFormSubmit({
        formId,
        onSubmit,
        setChanged,
    });

    const { setExitDialogSubmitRef } = useExitFormDialog({
        formId: COLLECTION_DETAILS_FORM_ID,
    });

    const [description, changeDescription] = useRichText({
        initial: collection?.description,
        triggerChange,
    });

    const {
        isMetadataModified,
        isPrivateMetadataModified,
        makeChangeHandler: makeMetadataChangeHandler,
    } = useMetadataChangeTrigger();

    const changeMetadata = makeMetadataChangeHandler(handleChange);

    // Need to make it function to always have description.current up to date
    const getData = (): CollectionUpdateData => ({
        ...formData,
        description: description.current,
    });

    const getSubmitData = (): CollectionUpdateData => ({
        ...getData(),
        ...getMetadata(formData, isMetadataModified, isPrivateMetadataModified),
    });

    const handleChannelChange = createChannelsChangeHandler(
        currentChannels,
        setChannels,
        triggerChange
    );

    const submit = () => handleFormSubmit(getSubmitData());

    useEffect(() => setExitDialogSubmitRef(submit), [submit]);

    return {
        change: handleChange,
        data: getData(),
        handlers: {
            changeChannels: handleChannelChange,
            changeDescription,
            changeMetadata,
        },
        hasChanged,
        submit,
    };
}

const CollectionUpdateForm: React.FC<CollectionUpdateFormProps> = ({
    collection,
    currentChannels,
    setChannels,
    children,
    onSubmit,
}) => {
    const props = useCollectionUpdateForm(collection, currentChannels, setChannels, onSubmit);

    return <form onSubmit={props.submit}>{children(props)}</form>;
};

CollectionUpdateForm.displayName = "CollectionUpdateForm";

export default CollectionUpdateForm;
