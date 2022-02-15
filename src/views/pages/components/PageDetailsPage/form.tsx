// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { AttributeInput } from "@mzawadie/components/Attributes";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import { FetchMoreProps, ReorderEvent } from "@mzawadie/core";
import useForm, { FormChange, SubmitPromise } from "@mzawadie/hooks/useForm";
import useFormset, { FormsetChange, FormsetData } from "@mzawadie/hooks/useFormset";
import getPublicationData from "@mzawadie/utils/data/getPublicationData";
import handleFormSubmit from "@mzawadie/utils/handlers/handleFormSubmit";
import { mapMetadataItemToInput } from "@mzawadie/utils/maps";
import getMetadata from "@mzawadie/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@mzawadie/utils/richText/useRichText";
import { getAttributesDisplayData } from "@mzawadie/views/attributes/utils/data";
import {
    createAttributeChangeHandler,
    createAttributeFileChangeHandler,
    createAttributeMultiChangeHandler,
    createAttributeReferenceChangeHandler,
    createAttributeValueReorderHandler,
    createFetchMoreReferencesHandler,
    createFetchReferencesHandler,
} from "@mzawadie/views/attributes/utils/handlers";
import { PageDetails_page, PageDetails_page_pageType } from "@mzawadie/views/pages/types/PageDetails";
import { PageType_pageType } from "@mzawadie/views/pages/types/PageType";
import {
    getAttributeInputFromPage,
    getAttributeInputFromPageType,
} from "@mzawadie/views/pages/utils/data";
import { createPageTypeSelectHandler } from "@mzawadie/views/pages/utils/handlers";
import { SearchPageTypes_search_edges_node } from "@mzawadie/views/searches/types/SearchPageTypes";
import { SearchPages_search_edges_node } from "@mzawadie/views/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@mzawadie/views/searches/types/SearchProducts";
import React from "react";

export interface PageFormData extends MetadataFormData {
    isPublished: boolean;
    publicationDate: string;
    seoDescription: string;
    seoTitle: string;
    slug: string;
    title: string;
    pageType: PageType_pageType | PageDetails_page_pageType;
}
export interface PageData extends PageFormData {
    attributes: AttributeInput[];
    content: OutputData;
}

export interface PageSubmitData extends PageFormData {
    attributes: AttributeInput[];
    attributesWithNewFileValue: FormsetData<null, File>;
    content: OutputData;
}

export interface PageUpdateHandlers {
    changeMetadata: FormChange;
    changeContent: RichTextEditorChange;
    selectPageType: FormChange;
    selectAttribute: FormsetChange<string>;
    selectAttributeMulti: FormsetChange<string>;
    selectAttributeReference: FormsetChange<string[]>;
    selectAttributeFile: FormsetChange<File>;
    reorderAttributeValue: FormsetChange<ReorderEvent>;
    fetchReferences: (value: string) => void;
    fetchMoreReferences: FetchMoreProps;
}
export interface UsePageUpdateFormResult {
    change: FormChange;
    data: PageData;
    valid: boolean;
    handlers: PageUpdateHandlers;
    hasChanged: boolean;
    submit: () => void;
}

export interface UsePageFormOpts {
    pageTypes?: SearchPageTypes_search_edges_node[];
    referencePages: SearchPages_search_edges_node[];
    referenceProducts: SearchProducts_search_edges_node[];
    fetchReferencePages?: (data: string) => void;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchReferenceProducts?: (data: string) => void;
    fetchMoreReferenceProducts?: FetchMoreProps;
    assignReferencesAttributeId?: string;
    selectedPageType?: PageType_pageType;
    onSelectPageType: (pageTypeId: string) => void;
}

export interface PageFormProps extends UsePageFormOpts {
    children: (props: UsePageUpdateFormResult) => React.ReactNode;
    page: PageDetails_page;
    onSubmit: (data: PageData) => SubmitPromise;
}

function usePageForm(
    page: PageDetails_page,
    onSubmit: (data: PageData) => SubmitPromise,
    opts: UsePageFormOpts
): UsePageUpdateFormResult {
    const [changed, setChanged] = React.useState(false);
    const triggerChange = () => setChanged(true);

    const pageExists = page !== null;

    const attributes = useFormset(
        pageExists
            ? getAttributeInputFromPage(page)
            : opts.selectedPageType
            ? getAttributeInputFromPageType(opts.selectedPageType)
            : []
    );
    const attributesWithNewFileValue = useFormset<null, File>([]);

    const form = useForm<PageFormData>({
        isPublished: page?.isPublished,
        metadata: pageExists ? page?.metadata?.map(mapMetadataItemToInput) : [],
        pageType: null,
        privateMetadata: pageExists ? page?.privateMetadata?.map(mapMetadataItemToInput) : [],
        publicationDate: page?.publicationDate || "",
        seoDescription: page?.seoDescription || "",
        seoTitle: page?.seoTitle || "",
        slug: page?.slug || "",
        title: page?.title || "",
    });
    const [content, changeContent] = useRichText({
        initial: pageExists ? page?.content : null,
        triggerChange,
    });

    const {
        isMetadataModified,
        isPrivateMetadataModified,
        makeChangeHandler: makeMetadataChangeHandler,
    } = useMetadataChangeTrigger();

    const handleChange: FormChange = (event, cb) => {
        form.change(event, cb);
        triggerChange();
    };
    const changeMetadata = makeMetadataChangeHandler(handleChange);
    const handlePageTypeSelect = createPageTypeSelectHandler(opts.onSelectPageType, triggerChange);
    const handleAttributeChange = createAttributeChangeHandler(attributes.change, triggerChange);
    const handleAttributeMultiChange = createAttributeMultiChangeHandler(
        attributes.change,
        attributes.data,
        triggerChange
    );
    const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
        attributes.change,
        triggerChange
    );
    const handleFetchReferences = createFetchReferencesHandler(
        attributes.data,
        opts.assignReferencesAttributeId,
        opts.fetchReferencePages,
        opts.fetchReferenceProducts
    );
    const handleFetchMoreReferences = createFetchMoreReferencesHandler(
        attributes.data,
        opts.assignReferencesAttributeId,
        opts.fetchMoreReferencePages,
        opts.fetchMoreReferenceProducts
    );
    const handleAttributeFileChange = createAttributeFileChangeHandler(
        attributes.change,
        attributesWithNewFileValue.data,
        attributesWithNewFileValue.add,
        attributesWithNewFileValue.change,
        triggerChange
    );
    const handleAttributeValueReorder = createAttributeValueReorderHandler(
        attributes.change,
        attributes.data,
        triggerChange
    );

    // Need to make it function to always have content.current up to date
    const getData = (): PageData => ({
        ...form.data,
        attributes: getAttributesDisplayData(
            attributes.data,
            attributesWithNewFileValue.data,
            opts.referencePages,
            opts.referenceProducts
        ),
        content: content.current,
        pageType: pageExists ? page?.pageType : opts.selectedPageType,
    });

    const getSubmitData = (): PageSubmitData => ({
        ...getData(),
        ...getMetadata(form.data, isMetadataModified, isPrivateMetadataModified),
        ...getPublicationData(form.data),
        attributesWithNewFileValue: attributesWithNewFileValue.data,
    });

    const handleSubmit = async (data: PageData) => {
        const errors = await onSubmit(data);

        if (!errors?.length && pageExists) {
            attributesWithNewFileValue.set([]);
        }

        return errors;
    };

    const submit = () =>
        pageExists
            ? handleFormSubmit(getSubmitData(), handleSubmit, setChanged)
            : onSubmit(getSubmitData());

    const valid = pageExists || !!opts.selectedPageType;

    return {
        change: handleChange,
        data: getData(),
        valid,
        handlers: {
            changeContent,
            changeMetadata,
            fetchMoreReferences: handleFetchMoreReferences,
            fetchReferences: handleFetchReferences,
            reorderAttributeValue: handleAttributeValueReorder,
            selectAttribute: handleAttributeChange,
            selectAttributeFile: handleAttributeFileChange,
            selectAttributeMulti: handleAttributeMultiChange,
            selectAttributeReference: handleAttributeReferenceChange,
            selectPageType: handlePageTypeSelect,
        },
        hasChanged: changed,
        submit,
    };
}

const PageForm: React.FC<PageFormProps> = ({ children, page, onSubmit, ...rest }) => {
    const props = usePageForm(page, onSubmit, rest);

    return <form onSubmit={props.submit}>{children(props)}</form>;
};

PageForm.displayName = "PageForm";

export default PageForm;
