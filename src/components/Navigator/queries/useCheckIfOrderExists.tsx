import { gql } from "@apollo/client";
import makeQuery, { UseQueryResult } from "@mzawadie/hooks/graphql/makeQuery";
import useDebounce from "@mzawadie/hooks/useDebounce";
import { useState } from "react";

import { CheckIfOrderExists, CheckIfOrderExistsVariables } from "./types/CheckIfOrderExists";

const checkIfOrderExists = gql`
    query CheckIfOrderExists($id: ID!) {
        order(id: $id) {
            id
            status
        }
    }
`;

const useCheckIfOrderExistsQuery = makeQuery<CheckIfOrderExists, CheckIfOrderExistsVariables>(
    checkIfOrderExists
);

type UseCheckIfOrderExists = [
    UseQueryResult<CheckIfOrderExists, CheckIfOrderExistsVariables>,
    (query: string) => void
];
function useCheckIfOrderExists(): UseCheckIfOrderExists {
    const [id, setId] = useState("");
    const setIdDebounced = useDebounce(setId);
    const result = useCheckIfOrderExistsQuery({
        skip: id === "",
        variables: {
            id,
        },
    });

    return [result, setIdDebounced];
}

export default useCheckIfOrderExists;
