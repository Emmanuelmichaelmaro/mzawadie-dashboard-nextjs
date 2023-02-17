import { FormsetAtomicData } from "@mzawadie/hooks/useFormset";

export interface ProductStockFormsetData {
    quantityAllocated: number;
}

export type ProductStockInput = FormsetAtomicData<ProductStockFormsetData, string>;

export interface ProductStockFormData {
    sku: string;
    trackInventory: boolean;
    isPreorder: boolean;
    globalThreshold: string;
    globalSoldUnits: number;
    hasPreorderEndDate: boolean;
    preorderEndDateTime?: string;
}
