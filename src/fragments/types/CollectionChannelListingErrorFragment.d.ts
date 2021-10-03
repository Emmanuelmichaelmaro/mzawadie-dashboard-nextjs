import { ProductErrorCode } from "./../../types/globalTypes";
export interface CollectionChannelListingErrorFragment {
    __typename: "CollectionChannelListingError";
    code: ProductErrorCode;
    field: string | null;
    message: string | null;
    channels: string[] | null;
}
