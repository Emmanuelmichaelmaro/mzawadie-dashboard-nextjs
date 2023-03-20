// @ts-nocheck
import { useProductTranslationsQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import usePaginator from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsProductList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const navigate = useNavigator();
    const paginate = usePaginator();

    const { data, loading } = useProductTranslationsQuery({
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
                    node.__typename === "ProductTranslatableContent" && {
                        completion: {
                            current: sumCompleted([
                                node.translation?.description,
                                node.translation?.name,
                                node.translation?.seoDescription,
                                node.translation?.seoTitle,
                                ...(node.attributeValues?.map(
                                    ({ translation }) => translation?.richText
                                ) || []),
                            ]),
                            max: 4 + (node.attributeValues?.length || 0),
                        },
                        id: node?.product?.id,
                        name: node?.product?.name,
                    }
            )}
            onRowClick={(id) =>
                navigate(languageEntityUrl(variables.language, TranslatableEntities.products, id))
            }
            onNextPage={loadNextPage}
            onPreviousPage={loadPreviousPage}
            pageInfo={pageInfo}
        />
    );
};

export default TranslationsProductList;
