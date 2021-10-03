import { ProductMediaType } from "./../../types/globalTypes";
export interface ProductMediaFragment {
    __typename: "ProductMedia";
    id: string;
    alt: string;
    sortOrder: number | null;
    url: string;
    type: ProductMediaType;
    oembedData: any;
}
