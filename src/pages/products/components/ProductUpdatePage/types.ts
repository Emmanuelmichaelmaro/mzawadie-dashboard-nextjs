// @ts-nocheck
import { OutputData } from "@editorjs/editorjs";
import { AttributeInput } from "@mzawadie/components/Attributes";
import { ChannelOpts } from "@mzawadie/components/ChannelsAvailabilityCard/types";
import {
    DatagridChangeOpts,
    UseDatagridChangeState,
} from "@mzawadie/components/Datagrid/useDatagridChange";
import { MetadataFormData } from "@mzawadie/components/Metadata";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@mzawadie/components/SingleAutocompleteSelectField";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@mzawadie/core";
import {
    MetadataErrorFragment,
    ProductChannelListingUpdateInput,
    ProductFragment,
    SearchPagesQuery,
    SearchProductsQuery,
    SearchWarehousesQuery,
} from "@mzawadie/graphql";
import {
    CommonUseFormResultWithHandlers,
    FormChange,
    FormErrors,
    SubmitPromise,
} from "@mzawadie/hooks/useForm";
import { FormsetAtomicData, FormsetChange, FormsetData } from "@mzawadie/hooks/useFormset";
import { RichTextProps } from "@mzawadie/pages/attributes/utils/data";
import { UseProductUpdateHandlerError } from "@mzawadie/pages/products/views/ProductUpdate/handlers/useProductUpdateHandler";

import { ProductChannelsListingDialogSubmit } from "./ProductChannelsListingsDialog";

export interface ProductUpdateFormData extends MetadataFormData {
    category: string | null;
    changeTaxCode: boolean;
    chargeTaxes: boolean;
    collections: string[];
    isAvailable: boolean;
    name: string;
    rating: number;
    slug: string;
    seoDescription: string;
    seoTitle: string;
    sku: string;
    taxCode: string;
    trackInventory: boolean;
    isPreorder: boolean;
    globalThreshold: string;
    globalSoldUnits: number;
    hasPreorderEndDate: boolean;
    preorderEndDateTime?: string;
    weight: string;
}
export interface FileAttributeInputData {
    attributeId: string;
    file: File;
}
export type FileAttributeInput = FormsetAtomicData<FileAttributeInputData, string[]>;

export interface FileAttributesSubmitData {
    fileAttributes: FileAttributeInput[];
}
export interface ProductUpdateData extends ProductUpdateFormData {
    attributes: AttributeInput[];
    channels: ProductChannelListingUpdateInput;
    description: OutputData;
}
export interface ProductUpdateSubmitData extends ProductUpdateFormData {
    attributes: AttributeInput[];
    attributesWithNewFileValue: FormsetData<null, File>;
    channels: ProductChannelListingUpdateInput;
    collections: string[];
    description: OutputData;
    variants: DatagridChangeOpts;
}

export interface ProductUpdateHandlers
    extends Record<
            "changeMetadata" | "selectCategory" | "selectCollection" | "selectTaxRate",
            FormChange
        >,
        Record<"selectAttribute" | "selectAttributeMultiple", FormsetChange<string>> {
    changeChannels: (id: string, data: ChannelOpts) => void;
    selectAttributeReference: FormsetChange<string[]>;
    selectAttributeFile: FormsetChange<File>;
    reorderAttributeValue: FormsetChange<ReorderEvent>;
    changeVariants: (data: DatagridChangeOpts) => void;
    fetchReferences: (value: string) => void;
    fetchMoreReferences: FetchMoreProps;
    updateChannelList: ProductChannelsListingDialogSubmit;
}

export interface UseProductUpdateFormOutput
    extends CommonUseFormResultWithHandlers<ProductUpdateData, ProductUpdateHandlers>,
        RichTextProps {
    datagrid: UseDatagridChangeState;
    formErrors: FormErrors<ProductUpdateSubmitData>;
}

export type UseProductUpdateFormRenderProps = Omit<UseProductUpdateFormOutput, "datagrid" | "richText">;

export interface UseProductUpdateFormOpts
    extends Record<"categories" | "collections" | "taxTypes", SingleAutocompleteChoiceType[]> {
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCollections: React.Dispatch<React.SetStateAction<MultiAutocompleteChoiceType[]>>;
    setSelectedTaxType: React.Dispatch<React.SetStateAction<string>>;
    selectedCollections: MultiAutocompleteChoiceType[];
    warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
    hasVariants: boolean;
    referencePages: RelayToFlat<SearchPagesQuery["search"]>;
    referenceProducts: RelayToFlat<SearchProductsQuery["search"]>;
    fetchReferencePages?: (data: string) => void;
    fetchMoreReferencePages?: FetchMoreProps;
    fetchReferenceProducts?: (data: string) => void;
    fetchMoreReferenceProducts?: FetchMoreProps;
    assignReferencesAttributeId?: string;
    isSimpleProduct: boolean;
}

export type SubmitResult = SubmitPromise<Array<UseProductUpdateHandlerError | MetadataErrorFragment>>;

export interface ProductUpdateFormProps extends UseProductUpdateFormOpts {
    children: (props: UseProductUpdateFormRenderProps) => React.ReactNode;
    product: ProductFragment;
    onSubmit: (data: ProductUpdateSubmitData) => SubmitResult;
    refetch: () => Promise<any>;
    disabled: boolean;
}
