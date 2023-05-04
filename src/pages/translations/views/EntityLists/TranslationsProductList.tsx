// @ts-nocheck
import { useProductTranslationsQuery } from "@mzawadie/graphql";
import usePaginator, { PaginatorContext } from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsProductList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const { data, loading } = useProductTranslationsQuery({
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
                getRowHref={(id) =>
                    languageEntityUrl(variables.language, TranslatableEntities.products, id)
                }
            />
        </PaginatorContext.Provider>
    );
};

export default TranslationsProductList;
