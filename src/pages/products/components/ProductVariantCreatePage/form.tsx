// @ts-nocheck
import { AttributeInput } from "@mzawadie/components/Attributes";
import { useExitFormDialog } from "@mzawadie/components/Form/useExitFormDialog";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { errorMessages, FetchMoreProps, ReorderEvent } from "@mzawadie/core";
import useForm, {
    CommonUseFormResultWithHandlers,
    FormChange,
    FormErrors,
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
import { ProductVariantCreateData_product } from "@mzawadie/pages/products/types/ProductVariantCreateData";
import { getVariantAttributeInputFromProduct } from "@mzawadie/pages/products/utils/data";
import { createPreorderEndDateChangeHandler } from "@mzawadie/pages/products/utils/handlers";
import { SearchPages_search_edges_node } from "@mzawadie/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@mzawadie/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@mzawadie/searches/types/SearchWarehouses";
import useMetadataChangeTrigger from "@mzawadie/utils/metadata/useMetadataChangeTrigger";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

export interface ProductVariantCreateFormData extends MetadataFormData {
    sku: string;
    trackInventory: boolean;
    weight: string;
    isPreorder: boolean;
    globalThreshold: string;
    globalSoldUnits: number;
    hasPreorderEndDate: boolean;
    quantityLimitPerCustomer: number | null;
    preorderEndDateTime?: string;
}
export interface ProductVariantCreateData extends ProductVariantCreateFormData {
    attributes: AttributeInput[];
    attributesWithNewFileValue: FormsetData<null, File>;
    stocks: ProductStockInput[];
}

export interface UseProductVariantCreateFormOpts {
    warehouses: SearchWarehouses_search_edges_node[];
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
    changePreorderEndDate: FormChange;
    fetchReferences: (value: string) => void;
    fetchMoreReferences: FetchMoreProps;
}

export interface UseProductVariantCreateFormResult
    extends CommonUseFormResultWithHandlers<ProductVariantCreateData, ProductVariantCreateHandlers> {
    formErrors: FormErrors<ProductVariantCreateData>;
    disabled: boolean;
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
    isPreorder: false,
    globalThreshold: null,
    globalSoldUnits: 0,
    hasPreorderEndDate: false,
    preorderEndDateTime: "",
    quantityLimitPerCustomer: null,
};

function useProductVariantCreateForm(
    product: ProductVariantCreateData_product,
    onSubmit: (data: ProductVariantCreateData) => void,
    opts: UseProductVariantCreateFormOpts
): UseProductVariantCreateFormResult {
    const intl = useIntl();
    const attributeInput = getVariantAttributeInputFromProduct(product);

    const form = useForm(initial, undefined, { confirmLeave: true });

    const { setChanged, triggerChange, handleChange, hasChanged, data: formData, formId } = form;

    const attributes = useFormset(attributeInput);
    const attributesWithNewFileValue = useFormset<null, File>([]);
    const stocks = useFormset<ProductStockFormsetData, string>([]);

    const { setExitDialogSubmitRef } = useExitFormDialog({
        formId,
    });

    const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

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

    const handlePreorderEndDateChange = createPreorderEndDateChangeHandler(
        form,
        triggerChange,
        intl.formatMessage(errorMessages.preorderEndDateInFutureErrorText)
    );

    const data: ProductVariantCreateData = {
        ...formData,
        attributes: getAttributesDisplayData(
            attributes.data,
            attributesWithNewFileValue.data,
            opts.referencePages,
            opts.referenceProducts
        ),
        attributesWithNewFileValue: attributesWithNewFileValue.data,
        stocks: stocks.data,
    };

    const handleFormSubmit = useHandleFormSubmit({
        formId,
        onSubmit,
        setChanged,
    });

    const submit = () => handleFormSubmit(data);

    useEffect(() => setExitDialogSubmitRef(submit), [submit]);

    return {
        change: handleChange,
        data,
        disabled: data.isPreorder && data.hasPreorderEndDate && !!form.errors.preorderEndDateTime,
        formErrors: form.errors,
        handlers: {
            addStock: handleStockAdd,
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
        },
        hasChanged,
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
