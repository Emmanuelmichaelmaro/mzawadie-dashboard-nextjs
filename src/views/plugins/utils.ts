// @ts-nocheck
import { PluginConfigurationFragment_configuration } from "@mzawadie/fragments/types/PluginConfigurationFragment";
import { ConfigurationTypeFieldEnum } from "@mzawadie/types/globalTypes";

export function isSecretField(config: PluginConfigurationFragment_configuration[], field: string) {
    return [
        ConfigurationTypeFieldEnum.PASSWORD,
        ConfigurationTypeFieldEnum.SECRET,
        ConfigurationTypeFieldEnum.SECRETMULTILINE,
    ].includes(config.find((configField) => configField.name === field).type);
}
