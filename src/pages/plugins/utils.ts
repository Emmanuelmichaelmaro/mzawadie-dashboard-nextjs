// @ts-nocheck
import { ConfigurationTypeFieldEnum } from "@mzawadie/graphql";
import { PluginConfigurationExtendedFragment_configuration } from "@mzawadie/graphqlPluginConfigurationExtendedFragment";

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
