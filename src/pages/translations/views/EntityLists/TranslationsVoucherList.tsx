// @ts-nocheck
import { useVoucherTranslationsQuery } from "@mzawadie/graphql";
import usePaginator, { PaginatorContext } from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsVoucherList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const { data, loading } = useVoucherTranslationsQuery({
        displayLoader: true,
        variables,
    });

    const paginationValues = usePaginator({
        pageInfo: data?.translations?.pageInfo,
        paginationState: variables,
        queryString: params,
    });

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <TranslationsEntitiesList
                disabled={loading}
                entities={mapEdgesToItems(data?.translations)?.map(
                    (node) =>
                        node.__typename === "VoucherTranslatableContent" && {
                            completion: {
                                current: sumCompleted([node.translation?.name]),
                                max: 1,
                            },
                            id: node.voucher?.id,
                            name: node.voucher?.name || "-",
                        }
                )}
                getRowHref={(id) =>
                    languageEntityUrl(variables.language, TranslatableEntities.vouchers, id)
                }
            />
        </PaginatorContext.Provider>
    );
};

export default TranslationsVoucherList;
