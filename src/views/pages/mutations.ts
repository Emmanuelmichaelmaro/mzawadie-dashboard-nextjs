import { gql } from "@apollo/client";
import { TypedMutation } from "@mzawadie/core";
import { pageErrorFragment, pageErrorWithAttributesFragment } from "@mzawadie/fragments/errors";
import { pageDetailsFragment } from "@mzawadie/fragments/pages";
import makeMutation from "@mzawadie/hooks/makeMutation";

import { PageBulkPublish, PageBulkPublishVariables } from "./types/PageBulkPublish";
import { PageBulkRemove, PageBulkRemoveVariables } from "./types/PageBulkRemove";
import { PageCreate, PageCreateVariables } from "./types/PageCreate";
import { PageRemove, PageRemoveVariables } from "./types/PageRemove";
import { PageUpdate, PageUpdateVariables } from "./types/PageUpdate";

const pageCreate = gql`
    ${pageErrorWithAttributesFragment}
    mutation PageCreate($input: PageCreateInput!) {
        pageCreate(input: $input) {
            errors {
                ...PageErrorWithAttributesFragment
                message
            }
            page {
                id
            }
        }
    }
`;
export const TypedPageCreate = TypedMutation<PageCreate, PageCreateVariables>(pageCreate);

const pageUpdate = gql`
    ${pageDetailsFragment}
    ${pageErrorWithAttributesFragment}
    mutation PageUpdate(
        $id: ID!
        $input: PageInput!
        $firstValues: Int
        $afterValues: String
        $lastValues: Int
        $beforeValues: String
    ) {
        pageUpdate(id: $id, input: $input) {
            errors {
                ...PageErrorWithAttributesFragment
            }
            page {
                ...PageDetailsFragment
            }
        }
    }
`;
export const usePageUpdateMutation = makeMutation<PageUpdate, PageUpdateVariables>(pageUpdate);

const pageRemove = gql`
    ${pageErrorFragment}
    mutation PageRemove($id: ID!) {
        pageDelete(id: $id) {
            errors {
                ...PageErrorFragment
            }
        }
    }
`;
export const usePageRemoveMutation = makeMutation<PageRemove, PageRemoveVariables>(pageRemove);

const pageBulkPublish = gql`
    mutation PageBulkPublish($ids: [ID]!, $isPublished: Boolean!) {
        pageBulkPublish(ids: $ids, isPublished: $isPublished) {
            errors {
                field
                message
            }
        }
    }
`;
export const TypedPageBulkPublish = TypedMutation<PageBulkPublish, PageBulkPublishVariables>(
    pageBulkPublish
);

const pageBulkRemove = gql`
    mutation PageBulkRemove($ids: [ID]!) {
        pageBulkDelete(ids: $ids) {
            errors {
                field
                message
            }
        }
    }
`;
export const TypedPageBulkRemove = TypedMutation<PageBulkRemove, PageBulkRemoveVariables>(
    pageBulkRemove
);
