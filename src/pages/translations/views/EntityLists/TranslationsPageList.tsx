// @ts-nocheck
import { usePageTranslationsQuery } from "@mzawadie/graphql";
import usePaginator, { PaginatorContext } from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsPageList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const { data, loading } = usePageTranslationsQuery({
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
                        node.__typename === "PageTranslatableContent" && {
                            completion: {
                                current: sumCompleted([
                                    node.translation?.content,
                                    node.translation?.seoDescription,
                                    node.translation?.seoTitle,
                                    node.translation?.title,
                                ]),
                                max: 4,
                            },
                            id: node?.page.id,
                            name: node?.page.title,
                        }
                )}
                getRowHref={(id) =>
                    languageEntityUrl(variables.language, TranslatableEntities.pages, id)
                }
            />
        </PaginatorContext.Provider>
    );
};

export default TranslationsPageList;
