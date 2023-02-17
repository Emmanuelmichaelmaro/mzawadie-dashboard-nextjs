/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { DEFAULT_INITIAL_SEARCH_DATA, maybe } from "@mzawadie/core";
import { ChangeEvent, FormChange } from "@mzawadie/hooks/useForm";
import { useModalDialogOpen } from "@mzawadie/hooks/useModalDialogOpen";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useOrderDraftCreateMutation } from "@mzawadie/pages/orders/mutations";
import { orderUrl } from "@mzawadie/pages/orders/urls";
import useCustomerSearch from "@mzawadie/searches/useCustomerSearch";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { RefObject, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import getModeActions from "./modes";
import { getGqlOrderId, isQueryValidOrderNumber } from "./modes/orders";
import { getMode } from "./modes/utils";
import useSearchCatalog from "./queries/useCatalogSearch";
import useCheckIfOrderExists from "./queries/useCheckIfOrderExists";
import { QuickSearchAction, QuickSearchMode } from "./types";

type UseQuickSearch = [string, QuickSearchMode, FormChange, QuickSearchAction[]];

function useQuickSearch(open: boolean, input: RefObject<HTMLInputElement>): UseQuickSearch {
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<QuickSearchMode>("default");
    const intl = useIntl();
    const navigate = useNavigator();
    const [{ data: orderData }, getOrderData] = useCheckIfOrderExists();
    const { result: customers, search: searchCustomers } = useCustomerSearch({
        variables: {
            ...DEFAULT_INITIAL_SEARCH_DATA,
            first: 5,
        },
    });
    const [{ data: catalog }, searchCatalog] = useSearchCatalog(5);
    const [createOrder] = useOrderDraftCreateMutation({
        onCompleted: (result) => {
            if (result.draftOrderCreate?.errors.length === 0) {
                navigate(orderUrl(result.draftOrderCreate?.order?.id));
            }
        },
    });

    useModalDialogOpen(open, {
        onClose: () => {
            setMode("default");
            setQuery("");
        },
    });

    const handleBack = (event: KeyboardEvent) => {
        // `any` type because of poorly typed `KeyboardEvent.EventTarget` which
        // has no `value` key. Which it would have if `KeyboardEvent` and
        // `EventTarget` would be generic types accepting HTMLDOM element types.
        if ((event.target as any).value === "" && event.keyCode === 8) {
            setMode("default");
        }
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        setQuery("");
        if (mode !== "default" && input.current) {
            input.current.addEventListener("keyup", handleBack);

            return () => {
                if (input.current) {
                    input.current.removeEventListener("keyup", handleBack);
                }
            };
        }
    }, [mode, open]);

    const change = (event: ChangeEvent) => {
        const { value } = event.target;

        if (mode === "default" || mode === "help") {
            const newMode = getMode(value);
            if (newMode) {
                setMode(newMode);
            }
        }
        if (mode === "orders" && isQueryValidOrderNumber(value)) {
            getOrderData(getGqlOrderId(value));
        }
        if (mode === "catalog") {
            searchCatalog(value);
        }
        if (mode === "customers") {
            searchCustomers(value);
        }

        setQuery(value);
    };

    return [
        query,
        mode,
        change,
        getModeActions(
            mode,
            query,
            intl,
            {
                catalog,
                customers: mapEdgesToItems(customers?.data?.search) || [],
                order: maybe(() => orderData?.order),
            },
            {
                createOrder,
                navigate,
                setMode,
            }
        ),
    ];
}

export default useQuickSearch;
