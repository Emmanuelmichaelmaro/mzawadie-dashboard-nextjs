// @ts-nocheck
import { useCollectionTranslationsQuery } from "@mzawadie/graphql";
import usePaginator, { PaginatorContext } from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsCollectionList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const { data, loading } = useCollectionTranslationsQuery({
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
                        node.__typename === "CollectionTranslatableContent" && {
                            completion: {
                                current: sumCompleted([
                                    node.translation?.description,
                                    node.translation?.name,
                                    node.translation?.seoDescription,
                                    node.translation?.seoTitle,
                                ]),
                                max: 4,
                            },
                            id: node.collection.id,
                            name: node.collection.name,
                        }
                )}
                getRowHref={(id) =>
                    languageEntityUrl(variables.language, TranslatableEntities.collections, id)
                }
            />
        </PaginatorContext.Provider>
    );
};

export default TranslationsCollectionList;
