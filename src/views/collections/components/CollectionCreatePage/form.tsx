// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import useForm, { FormChange, SubmitPromise } from "@mzawadie/hooks/useForm";
import handleFormSubmit from "@mzawadie/utils/handlers/handleFormSubmit";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@mzawadie/utils/richText/useRichText";
import { ChannelCollectionData } from "@mzawadie/views/channels/utils";
import { createChannelsChangeHandler } from "@mzawadie/views/collections/utils";
import React from "react";

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
export interface UseCollectionCreateFormResult {
    change: FormChange;
    data: CollectionCreateData;
    handlers: CollectionCreateHandlers;
    hasChanged: boolean;
    submit: () => Promise<boolean>;
}

export interface CollectionCreateFormProps {
    currentChannels: ChannelCollectionData[];
    setChannels: (data: ChannelCollectionData[]) => void;
    children: (props: UseCollectionCreateFormResult) => React.ReactNode;
    onSubmit: (data: CollectionCreateData) => SubmitPromise;
}

function useCollectionCreateForm(
    currentChannels: ChannelCollectionData[],
    setChannels: (data: ChannelCollectionData[]) => void,
    onSubmit: (data: CollectionCreateData) => SubmitPromise
): UseCollectionCreateFormResult {
    const [changed, setChanged] = React.useState(false);
    const triggerChange = () => setChanged(true);

    const form = useForm<CollectionCreateFormData>({
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

    const [description, changeDescription] = useRichText({
        initial: null,
        triggerChange,
    });

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const handleChange: FormChange = (event, cb) => {
        form.change(event, cb);
        triggerChange();
    };

    const changeMetadata = makeMetadataChangeHandler(handleChange);

    // Need to make it function to always have description.current up to date
    const getData = (): CollectionCreateData => ({
        ...form.data,
        description: description.current,
    });

    const handleChannelChange = createChannelsChangeHandler(
        currentChannels,
        setChannels,
        triggerChange
    );

    const submit = () => handleFormSubmit(getData(), onSubmit, setChanged);

    return {
        change: handleChange,
        data: getData(),
        handlers: {
            changeChannels: handleChannelChange,
            changeDescription,
            changeMetadata,
        },
        hasChanged: changed,
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

    // eslint-disable-next-line react/destructuring-assignment
    return <form onSubmit={props.submit}>{children(props)}</form>;
};

CollectionCreateForm.displayName = "CollectionCreateForm";

export default CollectionCreateForm;
