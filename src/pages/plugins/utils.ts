// @ts-nocheck
import { PluginConfigurationExtendedFragment_configuration } from "@mzawadie/fragments/types/PluginConfigurationExtendedFragment";
import { ConfigurationTypeFieldEnum } from "@mzawadie/types/globalTypes";

export function isSecretField(
    config: PluginConfigurationExtendedFragment_configuration[],
    field: string
) {
    return [
        ConfigurationTypeFieldEnum.PASSWORD,
        ConfigurationTypeFieldEnum.SECRET,
        ConfigurationTypeFieldEnum.SECRETMULTILINE,
    ].includes(config.find((configField) => configField.name === field).type);
}
