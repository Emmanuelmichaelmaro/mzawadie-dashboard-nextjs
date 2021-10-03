import { CollectionErrorCode } from "./../../types/globalTypes";
export interface CollectionErrorFragment {
    __typename: "CollectionError";
    code: CollectionErrorCode;
    field: string | null;
}
