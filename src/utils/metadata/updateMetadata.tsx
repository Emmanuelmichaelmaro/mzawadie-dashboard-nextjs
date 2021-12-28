/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { gql } from "@apollo/client";
import { metadataErrorFragment } from "@mzawadie/fragments/errors";
import makeMutation from "@mzawadie/hooks/makeMutation";

import { metadataFragment } from "../../fragments/metadata";
import { UpdateMetadata, UpdateMetadataVariables } from "./types/UpdateMetadata";
import { UpdatePrivateMetadata, UpdatePrivateMetadataVariables } from "./types/UpdatePrivateMetadata";

const updateMetadata = gql`
    ${metadataFragment}
    ${metadataErrorFragment}
    mutation UpdateMetadata($id: ID!, $input: [MetadataInput!]!, $keysToDelete: [String!]!) {
        updateMetadata(id: $id, input: $input) {
            errors {
                ...MetadataErrorFragment
            }
        }
        deleteMetadata(id: $id, keys: $keysToDelete) {
            errors {
                ...MetadataErrorFragment
            }
            item {
                ...MetadataFragment
                ... on Node {
                    id
                }
            }
        }
    }
`;

export const useMetadataUpdate = makeMutation<UpdateMetadata, UpdateMetadataVariables>(updateMetadata);

const updatePrivateMetadata = gql`
    ${metadataFragment}
    ${metadataErrorFragment}
    mutation UpdatePrivateMetadata($id: ID!, $input: [MetadataInput!]!, $keysToDelete: [String!]!) {
        updatePrivateMetadata(id: $id, input: $input) {
            errors {
                ...MetadataErrorFragment
            }
        }
        deletePrivateMetadata(id: $id, keys: $keysToDelete) {
            errors {
                ...MetadataErrorFragment
            }
            item {
                ...MetadataFragment
                ... on Node {
                    id
                }
            }
        }
    }
`;

export const usePrivateMetadataUpdate = makeMutation<
    UpdatePrivateMetadata,
    UpdatePrivateMetadataVariables
>(updatePrivateMetadata);
