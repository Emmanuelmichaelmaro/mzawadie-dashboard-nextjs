import { gql } from "@apollo/client";
import makeMutation from "@mzawadie/hooks/makeMutation";

import { channelDetailsFragment, channelErrorFragment } from "../../fragments/channels";
import { ChannelActivate, ChannelActivateVariables } from "./types/ChannelActivate";
import { ChannelCreate, ChannelCreateVariables } from "./types/ChannelCreate";
import { ChannelDeactivate, ChannelDeactivateVariables } from "./types/ChannelDeactivate";
import { ChannelDelete, ChannelDeleteVariables } from "./types/ChannelDelete";
import { ChannelUpdate, ChannelUpdateVariables } from "./types/ChannelUpdate";

export const channelCreateMutation = gql`
    ${channelErrorFragment}
    ${channelDetailsFragment}
    mutation ChannelCreate($input: ChannelCreateInput!) {
        channelCreate(input: $input) {
            channel {
                ...ChannelDetailsFragment
            }
            errors {
                ...ChannelErrorFragment
            }
        }
    }
`;

export const channelUpdateMutation = gql`
    ${channelErrorFragment}
    ${channelDetailsFragment}
    mutation ChannelUpdate($id: ID!, $input: ChannelUpdateInput!) {
        channelUpdate(id: $id, input: $input) {
            channel {
                ...ChannelDetailsFragment
            }
            errors {
                ...ChannelErrorFragment
            }
        }
    }
`;

export const channelDeleteMutation = gql`
    ${channelErrorFragment}
    mutation ChannelDelete($id: ID!, $input: ChannelDeleteInput) {
        channelDelete(id: $id, input: $input) {
            errors {
                ...ChannelErrorFragment
            }
        }
    }
`;

export const channelActivateMutation = gql`
    ${channelErrorFragment}
    ${channelDetailsFragment}
    mutation ChannelActivate($id: ID!) {
        channelActivate(id: $id) {
            channel {
                ...ChannelDetailsFragment
            }
            errors {
                ...ChannelErrorFragment
            }
        }
    }
`;

export const channelDeactivateMutation = gql`
    ${channelErrorFragment}
    ${channelDetailsFragment}
    mutation ChannelDeactivate($id: ID!) {
        channelDeactivate(id: $id) {
            channel {
                ...ChannelDetailsFragment
            }
            errors {
                ...ChannelErrorFragment
            }
        }
    }
`;

export const useChannelCreateMutation = makeMutation<ChannelCreate, ChannelCreateVariables>(
    channelCreateMutation
);

export const useChannelUpdateMutation = makeMutation<ChannelUpdate, ChannelUpdateVariables>(
    channelUpdateMutation
);

export const useChannelDeleteMutation = makeMutation<ChannelDelete, ChannelDeleteVariables>(
    channelDeleteMutation
);

export const useChannelActivateMutation = makeMutation<ChannelActivate, ChannelActivateVariables>(
    channelActivateMutation
);

export const useChannelDeactivateMutation = makeMutation<ChannelDeactivate, ChannelDeactivateVariables>(
    channelDeactivateMutation
);
