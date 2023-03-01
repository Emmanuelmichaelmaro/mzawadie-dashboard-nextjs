// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { AttributeInput, AttributeInputData } from "@mzawadie/components/Attributes";
import { useExitFormDialog } from "@mzawadie/components/Form/useExitFormDialog";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { FetchMoreProps, ReorderEvent, errorMessages } from "@mzawadie/core";
import useForm, {
    CommonUseFormResultWithHandlers,
    FormChange,
    FormErrors,
    SubmitPromise,
} from "@mzawadie/hooks/useForm";
import useFormset, { FormsetChange, FormsetData } from "@mzawadie/hooks/useFormset";
import useHandleFormSubmit from "@mzawadie/hooks/useHandleFormSubmit";
import { getAttributesDisplayData } from "@mzawadie/pages/attributes/utils/data";
import {
    createAttributeChangeHandler,
    createAttributeFileChangeHandler,
    createAttributeMultiChangeHandler,
    createAttributeReferenceChangeHandler,
    createAttributeValueReorderHandler,
    createFetchMoreReferencesHandler,
    createFetchReferencesHandler,
} from "@mzawadie/pages/attributes/utils/handlers";
import { ChannelData, ChannelPriceArgs } from "@mzawadie/pages/channels/utils";
import { ProductType_productType } from "@mzawadie/pages/products/types/ProductType";
import { getAttributeInputFromProductType, ProductType } from "@mzawadie/pages/products/utils/data";
import {
    createChannelsChangeHandler,
    createChannelsPriceChangeHandler,
    createProductTypeSelectHandler,
    createPreorderEndDateChangeHandler,
} from "@mzawadie/pages/products/utils/handlers";
import { validateCostPrice, validatePrice } from "@mzawadie/pages/products/utils/validation";
import { PRODUCT_CREATE_FORM_ID } from "@mzawadie/pages/products/views/ProductCreate/consts";
import { SearchPages_search_edges_node } from "@mzawadie/searches/types/SearchPages";
import { SearchProductTypes_search_edges_node } from "@mzawadie/searches/types/SearchProductTypes";
import { SearchProducts_search_edges_node } from "@mzawadie/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@mzawadie/searches/types/SearchWarehouses";
import createMultiAutocompleteSelectHandler from "@mzawadie/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@mzawadie/utils/richText/useRichText";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

export interface ProductCreateFormData extends MetadataFormData {
    category: string;
    changeTaxCode: boolean;
    channelListings: ChannelData[];
    chargeTaxes: boolean;
    collections: string[];
    description: OutputData;
    isAvailable: boolean;
    name: string;
    productType: ProductType;
    rating: number;
    seoDescription: string;
    seoTitle: string;
    sku: string;
    slug: string;
    stockQuantity: number;
    taxCode: string;
    trackInventory: boolean;
    isPreorder: boolean;
    globalThreshold: string;
    globalSoldUnits: number;
    hasPreorderEndDate: boolean;
    preorderEndDateTime: string;
    weight: string;
}

export interface ProductCreateData extends ProductCreateFormData {
    attributes: AttributeInput[];
    attributesWithNewFileValue: FormsetData<null, File>;
    stocks: ProductStockInput[];
}

export interface ProductCreateHandlers
    extends Record<
            | "changeMetadata"
            | "selectCategory"
            | "selectCollection"
            | "selectProductType"
            | "selectTaxRate",
            FormChange
        >,
        Record<"changeStock" | "selectAttribute" | "selectAttributeMultiple", FormsetChange<string>>,
        Record<"changeChannelPrice", (id: string, data: ChannelPriceArgs) => void>,
        Record<
            "changeChannels",
            (id: string, data: Omit<ChannelData, "name" | "price" | "currency" | "id">) => void
        >,
        Record<"selectAttributeReference", FormsetChange<string[]>>,
        Record<"selectAttributeFile", FormsetChange<File>>,
        Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
        Record<"addStock" | "deleteStock", (id: string) => void> {
    changeDescription: RichTextEditorChange;
    changePreorderEndDate: FormChange;
    fetchReferences: (value: string) => void;
    fetchMoreReferences: FetchMoreProps;
}

export interface UseProductCreateFormResult
    extends CommonUseFormResultWithHandlers<ProductCreateData, ProductCreateHandlers> {
    disabled: boolean;
    formErrors: FormErrors<ProductCreateData>;
}

export interface UseProductCreateFormOpts
    extends Record<"categories" | "collections" | "taxTypes", SingleAutocompleteChoiceType[]> {
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCollections: React.Dispatch<React.SetStateAction<MultiAutocompleteChoiceType[]>>;
    setSelectedTaxType: React.Dispatch<React.SetStateAction<string>>;
    setChannels: (channels: ChannelData[]) => void;
    selectedCollections: MultiAutocompleteChoiceType[];
    productTypes: SearchProductTypes_search_edges_node[];
    warehouses: SearchWarehouses_search_edges_node[];
    currentChannels: ChannelData[];
    referencePages: SearchPages_search_edges_node[];
    referenceProducts: SearchProducts_search_edges_node[];
    fetchReferencePages?: (data: string) => void;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchReferenceProducts?: (data: string) => void;
    fetchMoreReferenceProducts?: FetchMoreProps;
    assignReferencesAttributeId?: string;
    selectedProductType?: ProductType_productType;
    onSelectProductType: (productTypeId: string) => void;
}

export interface ProductCreateFormProps extends UseProductCreateFormOpts {
    children: (props: UseProductCreateFormResult) => React.ReactNode;
    initial?: Partial<ProductCreateFormData>;
    onSubmit: (data: ProductCreateData) => SubmitPromise;
}

function useProductCreateForm(
    initial: Partial<ProductCreateFormData>,
    onSubmit: (data: ProductCreateData) => SubmitPromise,
    opts: UseProductCreateFormOpts
): UseProductCreateFormResult {
    const intl = useIntl();
    const defaultInitialFormData: ProductCreateFormData & Record<"productType", string> = {
        category: "",
        changeTaxCode: false,
        channelListings: opts.currentChannels,
        chargeTaxes: false,
        collections: [],
        description: null,
        isAvailable: false,
        metadata: [],
        name: "",
        privateMetadata: [],
        productType: null,
        rating: 0,
        seoDescription: "",
        seoTitle: "",
        sku: "",
        slug: "",
        stockQuantity: null,
        taxCode: null,
        trackInventory: false,
        weight: "",
        globalSoldUnits: 0,
        globalThreshold: "",
        isPreorder: false,
        hasPreorderEndDate: false,
        preorderEndDateTime: "",
    };

    const form = useForm(
        {
            ...initial,
            ...defaultInitialFormData,
        },
        undefined,
        { confirmLeave: true, formId: PRODUCT_CREATE_FORM_ID }
    );

    const {
        triggerChange,
        toggleValue,
        handleChange,
        hasChanged,
        data: formData,
        setChanged,
        formId,
    } = form;

    const attributes = useFormset<AttributeInputData>(
        opts.selectedProductType ? getAttributeInputFromProductType(opts.selectedProductType) : []
    );

    const attributesWithNewFileValue = useFormset<null, File>([]);

    const stocks = useFormset<ProductStockFormsetData>([]);

    const [description, changeDescription] = useRichText({
        initial: null,
        triggerChange,
    });

    const { setExitDialogSubmitRef } = useExitFormDialog({
        formId: PRODUCT_CREATE_FORM_ID,
    });

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const handleCollectionSelect = createMultiAutocompleteSelectHandler(
        toggleValue,
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

    const handleProductTypeSelect = createProductTypeSelectHandler(
        opts.onSelectProductType,
        triggerChange
    );

    const handleStockChange: FormsetChange<string> = (id, value) => {
        triggerChange();
        stocks.change(id, value);
    };

    const handleStockAdd = (id: string) => {
        triggerChange();
        stocks.add({
            data: {
                quantityAllocated: 0,
            },
            id,
            label: opts.warehouses.find((warehouse) => warehouse.id === id).name,
            value: "0",
        });
    };

    const handleStockDelete = (id: string) => {
        triggerChange();
        stocks.remove(id);
    };

    const handleTaxTypeSelect = createSingleAutocompleteSelectHandler(
        handleChange,
        opts.setSelectedTaxType,
        opts.taxTypes
    );

    const changeMetadata = makeMetadataChangeHandler(handleChange);

    const handleChannelsChange = createChannelsChangeHandler(
        opts.currentChannels,
        opts.setChannels,
        triggerChange
    );

    const handleChannelPriceChange = createChannelsPriceChangeHandler(
        opts.currentChannels,
        opts.setChannels,
        triggerChange
    );

    const handlePreorderEndDateChange = createPreorderEndDateChangeHandler(
        form,
        triggerChange,
        intl.formatMessage(errorMessages.preorderEndDateInFutureErrorText)
    );

    const getData = (): ProductCreateData => ({
        ...formData,
        attributes: getAttributesDisplayData(
            attributes.data,
            attributesWithNewFileValue.data,
            opts.referencePages,
            opts.referenceProducts
        ),
        attributesWithNewFileValue: attributesWithNewFileValue.data,
        description: description.current,
        productType: opts.selectedProductType,
        stocks: stocks.data,
    });

    const data = getData();

    const handleFormSubmit = useHandleFormSubmit({
        formId,
        onSubmit,
        setChanged,
    });

    const submit = () => handleFormSubmit(data);

    useEffect(() => setExitDialogSubmitRef(submit), [submit]);

    const shouldEnableSave = () => {
        if (!data.name || !data.productType) {
            return false;
        }

        if (data.isPreorder && data.hasPreorderEndDate && !!form.errors.preorderEndDateTime) {
            return false;
        }

        if (opts.selectedProductType?.hasVariants) {
            return true;
        }

        const hasInvalidChannelListingPrices = data.channelListings.some(
            (channel) => validatePrice(channel.price) || validateCostPrice(channel.costPrice)
        );

        if (hasInvalidChannelListingPrices) {
            return false;
        }

        return true;
    };

    const disabled = !shouldEnableSave();

    return {
        change: handleChange,
        data,
        disabled,
        formErrors: form.errors,
        handlers: {
            addStock: handleStockAdd,
            changeChannelPrice: handleChannelPriceChange,
            changeChannels: handleChannelsChange,
            changeDescription,
            changeMetadata,
            changeStock: handleStockChange,
            changePreorderEndDate: handlePreorderEndDateChange,
            deleteStock: handleStockDelete,
            fetchMoreReferences: handleFetchMoreReferences,
            fetchReferences: handleFetchReferences,
            reorderAttributeValue: handleAttributeValueReorder,
            selectAttribute: handleAttributeChange,
            selectAttributeFile: handleAttributeFileChange,
            selectAttributeMultiple: handleAttributeMultiChange,
            selectAttributeReference: handleAttributeReferenceChange,
            selectCategory: handleCategorySelect,
            selectCollection: handleCollectionSelect,
            selectProductType: handleProductTypeSelect,
            selectTaxRate: handleTaxTypeSelect,
        },
        hasChanged,
        submit,
    };
}

const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
    children,
    initial,
    onSubmit,
    ...rest
}) => {
    const props = useProductCreateForm(initial || {}, onSubmit, rest);

    return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductCreateForm.displayName = "ProductCreateForm";

export default ProductCreateForm;
