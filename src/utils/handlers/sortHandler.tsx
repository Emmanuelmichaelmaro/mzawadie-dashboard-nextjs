import { DEFAULT_INITIAL_PAGINATION_DATA, Sort } from "@mzawadie/core";

import { UseNavigatorResult } from "../../hooks/useNavigator";
import { getSortUrlVariables } from "../sort";

type CreateUrl<T extends string> = (params: Sort<T>) => string;

function createSortHandler<T extends string>(
    navigate: UseNavigatorResult,
    createUrl: CreateUrl<T>,
    params: Sort<T>
) {
    return (field: T) =>
        navigate(
            createUrl({
                ...params,
                ...getSortUrlVariables(field, params),
                ...DEFAULT_INITIAL_PAGINATION_DATA,
            }),
            true
        );
}

export default createSortHandler;
