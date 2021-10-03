export interface PageInfoFragment {
    __typename: "PageInfo";
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
}
