// @ts-nocheck
import { DEFAULT_INITIAL_PAGINATION_DATA, Pagination } from "@mzawadie/core";
import { useEffect } from "react";

import useNavigator from "./useNavigator";

export function usePaginationReset<T extends Pagination>(
    urlFunc: (params: T) => string,
    params: T,
    rowNumber: number
) {
    const navigate = useNavigator();

    useEffect(
        () =>
            navigate(
                urlFunc({
                    ...params,
                    ...DEFAULT_INITIAL_PAGINATION_DATA,
                }),
                { replace: true }
            ),
        [rowNumber]
    );

    useEffect(
        () =>
            navigate(
                urlFunc({
                    ...params,
                }),
                { replace: true }
            ),
        [params.before, params.after]
    );
}
