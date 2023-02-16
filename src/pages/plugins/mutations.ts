import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { pluginErrorFragment } from "@mzawadie/fragments/errors";
import { pluginsDetailsFragment } from "@mzawadie/fragments/plugins";

import { PluginUpdate, PluginUpdateVariables } from "./types/PluginUpdate";

const pluginUpdate = gql`
    ${pluginsDetailsFragment}
    ${pluginErrorFragment}
    mutation PluginUpdate($channelId: ID, $id: ID!, $input: PluginUpdateInput!) {
        pluginUpdate(channelId: $channelId, id: $id, input: $input) {
            errors {
                ...PluginErrorFragment
            }
            plugin {
                ...PluginsDetailsFragment
            }
        }
    }
`;
export const TypedPluginUpdate = TypedMutation<PluginUpdate, PluginUpdateVariables>(pluginUpdate);
