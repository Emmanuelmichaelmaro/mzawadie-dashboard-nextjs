import { ChannelErrorCode } from "./../../types/globalTypes";
export interface ChannelErrorFragment {
    __typename: "ChannelError";
    code: ChannelErrorCode;
    field: string | null;
    message: string | null;
}
