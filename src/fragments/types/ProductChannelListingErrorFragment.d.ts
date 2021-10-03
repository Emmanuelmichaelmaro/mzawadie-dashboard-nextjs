import { ProductErrorCode } from "./../../types/globalTypes";
export interface ProductChannelListingErrorFragment {
    __typename: "ProductChannelListingError";
    code: ProductErrorCode;
    field: string | null;
    message: string | null;
    channels: string[] | null;
}
