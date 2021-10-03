import { MenuErrorCode } from "./../../types/globalTypes";
export interface MenuErrorFragment {
    __typename: "MenuError";
    code: MenuErrorCode;
    field: string | null;
}
