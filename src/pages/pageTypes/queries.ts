import { gql } from "@apollo/client";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import { pageTypeDetailsFragment, pageTypeFragment } from "@mzawadie/fragments/pageTypes";
import makeQuery from "@mzawadie/hooks/makeQuery";

import { PageTypeDetails, PageTypeDetailsVariables } from "./types/PageTypeDetails";
import { PageTypeList, PageTypeListVariables } from "./types/PageTypeList";

export const pageTypeListQuery = gql`
    ${pageInfoFragment}
    ${pageTypeFragment}
    query PageTypeList(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $filter: PageTypeFilterInput
        $sort: PageTypeSortingInput
    ) {
        pageTypes(
            after: $after
            before: $before
            first: $first
            last: $last
            filter: $filter
            sortBy: $sort
        ) {
            edges {
                node {
                    ...PageTypeFragment
                    hasPages
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;
export const usePageTypeListQuery = makeQuery<PageTypeList, PageTypeListVariables>(pageTypeListQuery);

export const pageTypeDetailsQuery = gql`
    ${pageTypeDetailsFragment}
    query PageTypeDetails($id: ID!) {
        pageType(id: $id) {
            ...PageTypeDetailsFragment
            hasPages
        }
    }
`;
export const usePageTypeDetailsQuery = makeQuery<PageTypeDetails, PageTypeDetailsVariables>(
    pageTypeDetailsQuery
);
