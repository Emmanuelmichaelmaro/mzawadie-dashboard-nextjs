// @ts-nocheck
import {
    DatagridChangeOpts,
    DatagridChangeStateContext,
    useDatagridChangeState,
} from "@mzawadie/components/Datagrid/useDatagridChange";
import { useExitFormDialog } from "@mzawadie/components/Form/useExitFormDialog";
import { ProductFragment } from "@mzawadie/graphql";
import useForm from "@mzawadie/hooks/useForm";
import useFormset from "@mzawadie/hooks/useFormset";
import useHandleFormSubmit from "@mzawadie/hooks/useHandleFormSubmit";
import {
    getAttributesDisplayData,
    getRichTextAttributesFromMap,
    getRichTextDataFromAttributes,
    mergeAttributes,
} from "@mzawadie/pages/attributes/utils/data";
import {
    createAttributeChangeHandler,
    createAttributeFileChangeHandler,
    createAttributeMultiChangeHandler,
    createAttributeReferenceChangeHandler,
    createAttributeValueReorderHandler,
    createFetchMoreReferencesHandler,
    createFetchReferencesHandler,
} from "@mzawadie/pages/attributes/utils/handlers";
import {
    getAttributeInputFromProduct,
    getProductUpdatePageFormData,
} from "@mzawadie/pages/products/utils/data";
import { PRODUCT_UPDATE_FORM_ID } from "@mzawadie/pages/products/views/ProductUpdate/consts";
import createMultiAutocompleteSelectHandler from "@mzawadie/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import getMetadata from "@mzawadie/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@mzawadie/utils/richText/context";
import { useMultipleRichText } from "@mzawadie/utils/richText/useMultipleRichText";
import useRichText from "@mzawadie/utils/richText/useRichText";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { useProductChannelListingsForm } from "./formChannels";
import {
    ProductUpdateData,
    ProductUpdateFormProps,
    ProductUpdateSubmitData,
    SubmitResult,
    UseProductUpdateFormOpts,
    UseProductUpdateFormOutput,
} from "./types";

function useProductUpdateForm(
    product: ProductFragment,
    onSubmit: (data: ProductUpdateSubmitData) => SubmitResult,
    disabled: boolean,
    refetch: () => Promise<any>,
    opts: UseProductUpdateFormOpts
): UseProductUpdateFormOutput {
    const initial = useMemo(() => getProductUpdatePageFormData(product, product?.variants), [product]);

    const form = useForm(initial, undefined, {
        confirmLeave: true,
        formId: PRODUCT_UPDATE_FORM_ID,
    });

    const { handleChange, triggerChange, toggleValue, data: formData, setIsSubmitDisabled } = form;

    const datagrid = useDatagridChangeState();
    const variants = useRef<DatagridChangeOpts>({
        added: [],
        removed: [],
        updates: [],
    });
    const handleVariantChange = React.useCallback((data: DatagridChangeOpts) => {
        variants.current = data;
        triggerChange();
    }, []);

    const attributes = useFormset(getAttributeInputFromProduct(product));
    const { getters: attributeRichTextGetters, getValues: getAttributeRichTextValues } =
        useMultipleRichText({
            initial: getRichTextDataFromAttributes(attributes.data),
            triggerChange,
        });
    const attributesWithNewFileValue = useFormset<null, File>([]);
    const richText = useRichText({
        initial: product?.description,
        loading: !product,
        triggerChange,
    });

    const { setExitDialogSubmitRef } = useExitFormDialog({
        formId: PRODUCT_UPDATE_FORM_ID,
    });

    const {
        isMetadataModified,
        isPrivateMetadataModified,
        makeChangeHandler: makeMetadataChangeHandler,
    } = useMetadataChangeTrigger();

    const {
        channels,
        handleChannelChange,
        handleChannelListUpdate,
        touched: touchedChannels,
    } = useProductChannelListingsForm(product, triggerChange);

    const handleCollectionSelect = createMultiAutocompleteSelectHandler(
        (event) => toggleValue(event),
        opts.setSelectedCollections,
        opts.selectedCollections,
        opts.collections
    );
    
    const handleCategorySelect = createSingleAutocompleteSelectHandler(
        handleChange,
        opts.setSelectedCategory,
        opts.categories
    );
    
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
    
    const handleTaxTypeSelect = createSingleAutocompleteSelectHandler(
        handleChange,
        opts.setSelectedTaxType,
        opts.taxTypes
    );
    
    const changeMetadata = makeMetadataChangeHandler(handleChange);

    const data: ProductUpdateData = {
        ...formData,
        attributes: getAttributesDisplayData(
            attributes.data,
            attributesWithNewFileValue.data,
            opts.referencePages,
            opts.referenceProducts
        ),
        channels,
        description: null,
    };

    const getSubmitData = async (): Promise<ProductUpdateSubmitData> => ({
        ...data,
        ...getMetadata(data, isMetadataModified, isPrivateMetadataModified),
        attributes: mergeAttributes(
            attributes.data,
            getRichTextAttributesFromMap(attributes.data, await getAttributeRichTextValues())
        ),
        attributesWithNewFileValue: attributesWithNewFileValue.data,
        channels: {
            ...channels,
            updateChannels: channels.updateChannels.filter((listing) =>
                touchedChannels.current.includes(listing.channelId)
            ),
        },
        description: await richText.getValue(),
        variants: variants.current,
    });

    const handleSubmit = async (data: ProductUpdateSubmitData) => {
        const errors = await onSubmit(data);

        if (!errors?.length) {
            attributesWithNewFileValue.set([]);
        }

        return errors;
    };

    const handleFormSubmit = useHandleFormSubmit({
        formId: form.formId,
        onSubmit: handleSubmit,
    });

    const submit = useCallback(async () => {
        const result = await handleFormSubmit(await getSubmitData());
        await refetch();

        datagrid.setAdded((prevAdded) =>
            prevAdded.filter((_, index) =>
                result.some(
                    (error) =>
                        error.__typename === "DatagridError" &&
                        error.type === "create" &&
                        error.index === index
                )
            )
        );

        datagrid.changes.current = datagrid.changes.current.filter((change) =>
            datagrid.added.includes(change.row)
                ? result.some(
                      (error) =>
                          error.__typename === "DatagridError" &&
                          error.type === "create" &&
                          error.index === datagrid.added.findIndex((r) => r === change.row)
                  )
                : result.some(
                      (error) =>
                          error.__typename === "DatagridError" &&
                          error.type !== "create" &&
                          error.variantId === product.variants[change.row].id
                  )
        );

        datagrid.setRemoved([]);

        return result;
    }, [datagrid, handleFormSubmit, getSubmitData]);

    useEffect(() => setExitDialogSubmitRef(submit), [submit]);

    const isValid = () => {
        if (!data.name) {
            return false;
        }

        if (data.isPreorder && data.hasPreorderEndDate && !!form.errors.preorderEndDateTime) {
            return false;
        }

        return true;
    };

    const isSaveDisabled = disabled;

    const isSubmitDisabled = isSaveDisabled || !isValid();

    useEffect(() => {
        setIsSubmitDisabled(isSubmitDisabled);
    }, [isSubmitDisabled]);

    return {
        change: handleChange,
        data,
        datagrid,
        formErrors: form.errors,
        handlers: {
            changeChannels: handleChannelChange,
            changeMetadata,
            changeVariants: handleVariantChange,
            fetchMoreReferences: handleFetchMoreReferences,
            fetchReferences: handleFetchReferences,
            reorderAttributeValue: handleAttributeValueReorder,
            selectAttribute: handleAttributeChange,
            selectAttributeFile: handleAttributeFileChange,
            selectAttributeMultiple: handleAttributeMultiChange,
            selectAttributeReference: handleAttributeReferenceChange,
            selectCategory: handleCategorySelect,
            selectCollection: handleCollectionSelect,
            selectTaxRate: handleTaxTypeSelect,
            updateChannelList: handleChannelListUpdate,
        },
        submit,
        isSaveDisabled,
        richText,
        attributeRichTextGetters,
    };
}

const ProductUpdateForm: React.FC<ProductUpdateFormProps> = ({
    children,
    product,
    onSubmit,
    refetch,
    disabled,
    ...rest
}) => {
    const { datagrid, richText, ...props } = useProductUpdateForm(
        product,
        onSubmit,
        disabled,
        refetch,
        rest
    );

    return (
        <form onSubmit={props.submit}>
            <DatagridChangeStateContext.Provider value={datagrid}>
                <RichTextContext.Provider value={richText}>{children(props)}</RichTextContext.Provider>
            </DatagridChangeStateContext.Provider>
        </form>
    );
};

ProductUpdateForm.displayName = "ProductUpdateForm";

export default ProductUpdateForm;
