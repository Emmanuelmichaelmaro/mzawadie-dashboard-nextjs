import { OutputData } from "@editorjs/editorjs";
import { useExitFormDialog } from "@mzawadie/components/Form/useExitFormDialog";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import useForm, {
    CommonUseFormResultWithHandlers,
    FormChange,
    SubmitPromise,
} from "@mzawadie/hooks/useForm";
import useHandleFormSubmit from "@mzawadie/hooks/useHandleFormSubmit";
import { ChannelCollectionData } from "@mzawadie/pages/channels/utils";
import { createChannelsChangeHandler } from "@mzawadie/pages/collections/utils";
import { COLLECTION_CREATE_FORM_ID } from "@mzawadie/pages/collections/views/consts";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@mzawadie/utils/richText/useRichText";
import React, { useEffect } from "react";

export interface CollectionCreateFormData extends MetadataFormData {
    backgroundImage: {
        url: string;
        value: string;
    };
    backgroundImageAlt: string;
    channelListings: ChannelCollectionData[];
    name: string;
    slug: string;
    seoDescription: string;
    seoTitle: string;
}
export interface CollectionCreateData extends CollectionCreateFormData {
    description: OutputData;
}

interface CollectionCreateHandlers {
    changeMetadata: FormChange;
    changeDescription: RichTextEditorChange;
    changeChannels: (id: string, data: Omit<ChannelCollectionData, "name" | "id">) => void;
}
export type UseCollectionCreateFormResult = CommonUseFormResultWithHandlers<
    CollectionCreateData,
    CollectionCreateHandlers
>;

export interface CollectionCreateFormProps {
    currentChannels: ChannelCollectionData[];
    setChannels: (data: ChannelCollectionData[]) => void;
    children: (props: UseCollectionCreateFormResult) => React.ReactNode;
    onSubmit: (data: CollectionCreateData) => SubmitPromise;
}

const getInitialData = (currentChannels: ChannelCollectionData[]): CollectionCreateFormData => ({
    backgroundImage: {
        url: null,
        value: null,
    },
    backgroundImageAlt: "",
    channelListings: currentChannels,
    metadata: [],
    name: "",
    privateMetadata: [],
    seoDescription: "",
    seoTitle: "",
    slug: "",
});

function useCollectionCreateForm(
    currentChannels: ChannelCollectionData[],
    setChannels: (data: ChannelCollectionData[]) => void,
    onSubmit: (data: CollectionCreateData) => SubmitPromise
): UseCollectionCreateFormResult {
    const {
        handleChange,
        data: formData,
        triggerChange,
        setChanged,
        hasChanged,
        formId,
    } = useForm(getInitialData(currentChannels), undefined, {
        confirmLeave: true,
        formId: COLLECTION_CREATE_FORM_ID,
    });

    const handleFormSubmit = useHandleFormSubmit({
        formId,
        onSubmit,
        setChanged,
    });

    const { setExitDialogSubmitRef } = useExitFormDialog({
        formId,
    });

    const [description, changeDescription] = useRichText({
        initial: null,
        triggerChange,
    });

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const changeMetadata = makeMetadataChangeHandler(handleChange);

    // Need to make it function to always have description.current up to date
    const getData = (): CollectionCreateData => ({
        ...formData,
        description: description.current,
    });

    const handleChannelChange = createChannelsChangeHandler(
        currentChannels,
        setChannels,
        triggerChange
    );

    const submit = () => handleFormSubmit(getData());

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

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    currentChannels,
    setChannels,
    children,
    onSubmit,
}) => {
    const props = useCollectionCreateForm(currentChannels, setChannels, onSubmit);

    return <form onSubmit={props.submit}>{children(props)}</form>;
};

CollectionCreateForm.displayName = "CollectionCreateForm";

export default CollectionCreateForm;
