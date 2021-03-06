import { gql } from "@apollo/client";
import { collectionFragment } from "@mzawadie/fragments/collections";
import makeQuery, { UseQueryResult } from "@mzawadie/hooks/makeQuery";
import useDebounce from "@mzawadie/hooks/useDebounce";
import { useState } from "react";

import { SearchCatalog, SearchCatalogVariables } from "./types/SearchCatalog";

const searchCatalog = gql`
    ${collectionFragment}
    query SearchCatalog($first: Int!, $query: String!) {
        categories(first: $first, filter: { search: $query }) {
            edges {
                node {
                    id
                    name
                }
            }
        }

        collections(first: $first, filter: { search: $query }) {
            edges {
                node {
                    ...CollectionFragment
                }
            }
        }

        products(first: $first, filter: { search: $query }) {
            edges {
                node {
                    id
                    category {
                        id
                        name
                    }
                    name
                }
            }
        }
    }
`;

const useSearchCatalogQuery = makeQuery<SearchCatalog, SearchCatalogVariables>(searchCatalog);

type UseSearchCatalog = [
    UseQueryResult<SearchCatalog, SearchCatalogVariables>,
    (query: string) => void
];
function useSearchCatalog(first: number): UseSearchCatalog {
    const [query, setQuery] = useState("");
    const setQueryDebounced = useDebounce(setQuery);
    const result = useSearchCatalogQuery({
        skip: query === "",
        variables: {
            first,
            query,
        },
    });

    return [result, setQueryDebounced];
}

export default useSearchCatalog;
