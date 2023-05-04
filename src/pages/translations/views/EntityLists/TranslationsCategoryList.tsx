// @ts-nocheck
import { useCategoryTranslationsQuery } from "@mzawadie/graphql";
import usePaginator, { PaginatorContext } from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsCategoryList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const { data, loading } = useCategoryTranslationsQuery({
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
                        node.__typename === "CategoryTranslatableContent" && {
                            completion: {
                                current: sumCompleted([
                                    node.translation?.description,
                                    node.translation?.name,
                                    node.translation?.seoDescription,
                                    node.translation?.seoTitle,
                                ]),
                                max: 4,
                            },
                            id: node?.category?.id,
                            name: node?.category?.name,
                        }
                )}
                getRowHref={(id) =>
                    languageEntityUrl(variables.language, TranslatableEntities.categories, id)
                }
            />
        </PaginatorContext.Provider>
    );
};

export default TranslationsCategoryList;
