import { PluginErrorCode } from "./../../types/globalTypes";
export interface PluginErrorFragment {
    __typename: "PluginError";
    code: PluginErrorCode;
    field: string | null;
}
