import { GiftCardErrorCode } from "./../../types/globalTypes";
export interface GiftCardError {
    __typename: "GiftCardError";
    code: GiftCardErrorCode;
    field: string | null;
}
