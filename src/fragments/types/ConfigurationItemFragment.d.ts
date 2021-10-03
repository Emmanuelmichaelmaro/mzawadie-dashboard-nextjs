import { ConfigurationTypeFieldEnum } from "./../../types/globalTypes";
export interface ConfigurationItemFragment {
    __typename: "ConfigurationItem";
    name: string;
    value: string | null;
    type: ConfigurationTypeFieldEnum | null;
    helpText: string | null;
    label: string | null;
}
