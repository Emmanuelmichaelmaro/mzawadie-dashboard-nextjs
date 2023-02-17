import { OutputData } from "@editorjs/editorjs";
import { AttributeInput } from "@mzawadie/components";
import { FormsetData } from "@mzawadie/hooks";
import { ProductStockInput } from "@mzawadie/pages/products/components/ProductStocks/ProductStocks";

import { ProductUpdatePageFormData } from "../../utils/data";

export interface ProductUpdatePageSubmitData extends ProductUpdatePageFormData {
    addStocks: ProductStockInput[];
    attributes: AttributeInput[];
    attributesWithNewFileValue: FormsetData<null, File>;
    collections: string[];
    description: OutputData;
    removeStocks: string[];
    updateStocks: ProductStockInput[];
}
