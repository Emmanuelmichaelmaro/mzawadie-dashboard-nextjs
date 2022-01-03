// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { AttributeInput, AttributeInputData } from "@mzawadie/components/Attributes";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { RichTextEditorChange } from "@mzawadie/components/RichTextEditor";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { FetchMoreProps, ReorderEvent } from "@mzawadie/core";
import useForm, { FormChange } from "@mzawadie/hooks/useForm";
import useFormset, { FormsetChange, FormsetData } from "@mzawadie/hooks/useFormset";
import createMultiAutocompleteSelectHandler from "@mzawadie/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@mzawadie/utils/handlers/singleAutocompleteSelectChangeHandler";
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
import { ChannelData, ChannelPriceArgs } from "@mzawadie/views/channels/utils";
import { ProductType_productType } from "@mzawadie/views/products/types/ProductType";
import { getAttributeInputFromProductType, ProductType } from "@mzawadie/views/products/utils/data";
import {
    createChannelsChangeHandler,
    createChannelsPriceChangeHandler,
    createProductTypeSelectHandler,
} from "@mzawadie/views/products/utils/handlers";
import { validateCostPrice, validatePrice } from "@mzawadie/views/products/utils/validation";
import { SearchPages_search_edges_node } from "@mzawadie/views/searches/types/SearchPages";
import { SearchProductTypes_search_edges_node } from "@mzawadie/views/searches/types/SearchProductTypes";
import { SearchProducts_search_edges_node } from "@mzawadie/views/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@mzawadie/views/searches/types/SearchWarehouses";
import React from "react";

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
    fetchReferences: (value: string) => void;
    fetchMoreReferences: FetchMoreProps;
}
export interface UseProductCreateFormResult {
    change: FormChange;
    data: ProductCreateData;
    disabled: boolean;
    handlers: ProductCreateHandlers;
    hasChanged: boolean;
    submit: () => Promise<boolean>;
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
    onSubmit: (data: ProductCreateData) => Promise<boolean>;
}

function useProductCreateForm(
    initial: Partial<ProductCreateFormData>,
    onSubmit: (data: ProductCreateData) => Promise<boolean>,
    opts: UseProductCreateFormOpts
): UseProductCreateFormResult {
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
    };

    const [changed, setChanged] = React.useState(false);
    const triggerChange = () => setChanged(true);

    const form = useForm({
        ...initial,
        ...defaultInitialFormData,
    });
    const attributes = useFormset<AttributeInputData>(
        opts.selectedProductType ? getAttributeInputFromProductType(opts.selectedProductType) : []
    );
    const attributesWithNewFileValue = useFormset<null, File>([]);
    const stocks = useFormset<ProductStockFormsetData>([]);
    const [description, changeDescription] = useRichText({
        initial: null,
        triggerChange,
    });

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const handleChange: FormChange = (event, cb) => {
        form.change(event, cb);
        triggerChange();
    };
    const handleCollectionSelect = createMultiAutocompleteSelectHandler(
        form.toggleValue,
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

    const getData = (): ProductCreateData => ({
        ...form.data,
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
    const submit = () => onSubmit(data);

    const disabled =
        !opts.selectedProductType?.hasVariants &&
        (!data.sku ||
            data.channelListings.some(
                (channel) => validatePrice(channel.price) || validateCostPrice(channel.costPrice)
            ));

    return {
        change: handleChange,
        data,
        disabled,
        handlers: {
            addStock: handleStockAdd,
            changeChannelPrice: handleChannelPriceChange,
            changeChannels: handleChannelsChange,
            changeDescription,
            changeMetadata,
            changeStock: handleStockChange,
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
        hasChanged: changed,
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
