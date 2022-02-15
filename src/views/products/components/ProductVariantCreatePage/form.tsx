// @ts-nocheck
import { AttributeInput } from "@mzawadie/components/Attributes";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { FetchMoreProps, ReorderEvent } from "@mzawadie/core";
import useForm, { FormChange } from "@mzawadie/hooks/useForm";
import useFormset, { FormsetChange, FormsetData } from "@mzawadie/hooks/useFormset";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
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
import { ChannelPriceData } from "@mzawadie/views/channels/utils";
import { ProductVariantCreateData_product } from "@mzawadie/views/products/types/ProductVariantCreateData";
import { getVariantAttributeInputFromProduct } from "@mzawadie/views/products/utils/data";
import { SearchPages_search_edges_node } from "@mzawadie/views/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@mzawadie/views/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@mzawadie/views/searches/types/SearchWarehouses";
import React from "react";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

export interface ProductVariantCreateFormData extends MetadataFormData {
    sku: string;
    trackInventory: boolean;
    weight: string;
}
export interface ProductVariantCreateData extends ProductVariantCreateFormData {
    attributes: AttributeInput[];
    attributesWithNewFileValue: FormsetData<null, File>;
    stocks: ProductStockInput[];
}

export interface UseProductVariantCreateFormOpts {
    warehouses: SearchWarehouses_search_edges_node[];
    currentChannels: ChannelPriceData[];
    referencePages: SearchPages_search_edges_node[];
    referenceProducts: SearchProducts_search_edges_node[];
    fetchReferencePages?: (data: string) => void;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchReferenceProducts?: (data: string) => void;
    fetchMoreReferenceProducts?: FetchMoreProps;
    assignReferencesAttributeId?: string;
}

export interface ProductVariantCreateHandlers
    extends Record<"changeStock" | "selectAttribute" | "selectAttributeMultiple", FormsetChange>,
        Record<"selectAttributeReference", FormsetChange<string[]>>,
        Record<"selectAttributeFile", FormsetChange<File>>,
        Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
        Record<"addStock" | "deleteStock", (id: string) => void> {
    changeMetadata: FormChange;
    fetchReferences: (value: string) => void;
    fetchMoreReferences: FetchMoreProps;
}

export interface UseProductVariantCreateFormResult {
    change: FormChange;
    data: ProductVariantCreateData;
    disabled: boolean;
    // TODO: type FormsetChange
    handlers: ProductVariantCreateHandlers;
    hasChanged: boolean;
    submit: () => void;
}

export interface ProductVariantCreateFormProps extends UseProductVariantCreateFormOpts {
    children: (props: UseProductVariantCreateFormResult) => React.ReactNode;
    product: ProductVariantCreateData_product;
    onSubmit: (data: ProductVariantCreateData) => void;
}

const initial: ProductVariantCreateFormData = {
    metadata: [],
    privateMetadata: [],
    sku: "",
    trackInventory: true,
    weight: "",
};

function useProductVariantCreateForm(
    product: ProductVariantCreateData_product,
    onSubmit: (data: ProductVariantCreateData) => void,
    opts: UseProductVariantCreateFormOpts
): UseProductVariantCreateFormResult {
    const [changed, setChanged] = React.useState(false);
    const triggerChange = () => setChanged(true);

    const attributeInput = getVariantAttributeInputFromProduct(product);

    const form = useForm(initial);
    const attributes = useFormset(attributeInput);
    const attributesWithNewFileValue = useFormset<null, File>([]);
    const stocks = useFormset<ProductStockFormsetData, string>([]);
    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

    const handleChange: FormChange = (event, cb) => {
        form.change(event, cb);
        triggerChange();
    };
    const changeMetadata = makeMetadataChangeHandler(handleChange);
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
    const handleStockChange = (id: string, value: string) => {
        triggerChange();
        stocks.change(id, value);
    };
    const handleStockDelete = (id: string) => {
        triggerChange();
        stocks.remove(id);
    };

    const data: ProductVariantCreateData = {
        ...form.data,
        attributes: getAttributesDisplayData(
            attributes.data,
            attributesWithNewFileValue.data,
            opts.referencePages,
            opts.referenceProducts
        ),
        attributesWithNewFileValue: attributesWithNewFileValue.data,
        stocks: stocks.data,
    };

    const submit = () => onSubmit(data);

    return {
        change: handleChange,
        data,
        disabled: false,
        handlers: {
            addStock: handleStockAdd,
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
        },
        hasChanged: changed,
        submit,
    };
}

const ProductVariantCreateForm: React.FC<ProductVariantCreateFormProps> = ({
    children,
    product,
    onSubmit,
    ...rest
}) => {
    const props = useProductVariantCreateForm(product, onSubmit, rest);

    return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductVariantCreateForm.displayName = "ProductVariantCreateForm";
export default ProductVariantCreateForm;
