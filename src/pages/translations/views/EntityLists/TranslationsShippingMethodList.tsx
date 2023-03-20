// @ts-nocheck
import { useShippingMethodTranslationsQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import usePaginator from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsShippingMethodList: React.FC<TranslationsEntityListProps> = ({
    params,
    variables,
}) => {
    const navigate = useNavigator();
    const paginate = usePaginator();

    const { data, loading } = useShippingMethodTranslationsQuery({
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
                    node.__typename === "ShippingMethodTranslatableContent" && {
                        completion: {
                            current: sumCompleted([
                                node.translation?.name,
                                node.translation?.description,
                            ]),
                            max: 2,
                        },
                        id: node?.shippingMethod.id,
                        name: node?.name,
                    }
            )}
            onRowClick={(id) =>
                navigate(
                    languageEntityUrl(variables.language, TranslatableEntities.shippingMethods, id)
                )
            }
            onNextPage={loadNextPage}
            onPreviousPage={loadPreviousPage}
            pageInfo={pageInfo}
        />
    );
};

export default TranslationsShippingMethodList;
