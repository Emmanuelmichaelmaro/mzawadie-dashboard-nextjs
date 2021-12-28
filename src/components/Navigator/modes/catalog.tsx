// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SearchCatalog } from "@mzawadie/components/Navigator/queries/types/SearchCatalog";
import { QuickSearchAction, QuickSearchActionInput } from "@mzawadie/components/Navigator/types";
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { categoryUrl } from "@mzawadie/views/categories/urls";
import { collectionUrl } from "@mzawadie/views/collections/urls";
import { productUrl } from "@mzawadie/views/products/urls";
import { score } from "fuzzaldrin";
import { IntlShape } from "react-intl";

import messages from "./messages";
import { sortScores } from "./utils";

const maxActions = 5;

export function searchInCatalog(
    search: string,
    intl: IntlShape,
    navigate: UseNavigatorResult,
    catalog: SearchCatalog | undefined
): QuickSearchAction[] {
    const categories: QuickSearchActionInput[] = (mapEdgesToItems(catalog?.categories) || [])
        .map<QuickSearchActionInput>((category) => ({
            caption: intl.formatMessage(messages.category),
            label: category.name,
            onClick: () => {
                navigate(categoryUrl(category.id));
                return false;
            },
            score: score(category.name, search),
            text: category.name,
            type: "catalog",
        }))
        .sort(sortScores);

    const collections: QuickSearchActionInput[] = (mapEdgesToItems(catalog?.collections) || [])
        .map<QuickSearchActionInput>((collection) => ({
            caption: intl.formatMessage(messages.collection),
            label: collection.name,
            onClick: () => {
                navigate(collectionUrl(collection.id));
                return false;
            },
            score: score(collection.name, search),
            text: collection.name,
            type: "catalog",
        }))
        .sort(sortScores);

    const products: QuickSearchActionInput[] = (mapEdgesToItems(catalog?.products) || [])
        .map<QuickSearchActionInput>((product) => ({
            caption: intl.formatMessage(messages.product),
            extraInfo: product.category?.name,
            label: product.name,
            onClick: () => {
                navigate(productUrl(product.id));
                return false;
            },
            score: score(product.name, search),
            text: product.name,
            type: "catalog",
        }))
        .sort(sortScores);

    const baseActions = [
        ...categories.slice(0, 1),
        ...collections.slice(0, 1),
        ...products.slice(0, 1),
    ];

    return [
        ...baseActions,
        ...[...categories.slice(1), ...collections.slice(1), ...products.slice(1)]
            .sort(sortScores)
            .slice(0, maxActions - baseActions.length),
    ].sort(sortScores);
}

function getCatalogModeActions(
    query: string,
    intl: IntlShape,
    navigate: UseNavigatorResult,
    catalog: SearchCatalog | undefined
): QuickSearchAction[] {
    return searchInCatalog(query, intl, navigate, catalog);
}

export default getCatalogModeActions;
