// @ts-nocheck
import { usePageTranslationsQuery } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import usePaginator from "@mzawadie/hooks/usePaginator";
import { TranslationsEntitiesList } from "@mzawadie/pages/translations/components/TranslationsEntitiesList";
import { languageEntityUrl, TranslatableEntities } from "@mzawadie/pages/translations/urls";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";

import { TranslationsEntityListProps } from "./types";
import { sumCompleted } from "./utils";

const TranslationsPageList: React.FC<TranslationsEntityListProps> = ({ params, variables }) => {
    const navigate = useNavigator();
    const paginate = usePaginator();

    const { data, loading } = usePageTranslationsQuery({
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
            onRowClick={(id) =>
                navigate(languageEntityUrl(variables.language, TranslatableEntities.pages, id))
            }
            onNextPage={loadNextPage}
            onPreviousPage={loadPreviousPage}
            pageInfo={pageInfo}
        />
    );
};

export default TranslationsPageList;
