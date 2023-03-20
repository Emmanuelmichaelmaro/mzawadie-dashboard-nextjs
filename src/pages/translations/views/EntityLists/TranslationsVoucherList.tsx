// @ts-nocheck
import { useVoucherTranslationsQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import usePaginator from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsVoucherList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const navigate = useNavigator();
    const paginate = usePaginator();

    const { data, loading } = useVoucherTranslationsQuery({
        displayLoader: true,
        variables,
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        data?.translations?.pageInfo,
        variables,
        params
    );

    return (
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
            onRowClick={(id) =>
                navigate(languageEntityUrl(variables.language, TranslatableEntities.vouchers, id))
            }
            onNextPage={loadNextPage}
            onPreviousPage={loadPreviousPage}
            pageInfo={pageInfo}
        />
    );
};

export default TranslationsVoucherList;
