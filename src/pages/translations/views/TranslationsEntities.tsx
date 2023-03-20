// @ts-nocheck
import { PAGINATE_BY, maybe } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { createPaginationState } from "@mzawadie/hooks/usePaginator";
import useShop from "@mzawadie/hooks/useShop";
import { stringifyQs } from "@mzawadie/utils/urls";
import React from "react";

import { TranslationsEntitiesListPage } from "../components/TranslationsEntitiesListPage";
import { LanguageEntitiesUrlQueryParams, languageListUrl, TranslatableEntities } from "../urls";
import TranslationsAttributeList from "./EntityLists/TranslationsAttributeList";
import TranslationsCategoryList from "./EntityLists/TranslationsCategoryList";
import TranslationsCollectionList from "./EntityLists/TranslationsCollectionList";
import TranslationsPageList from "./EntityLists/TranslationsPageList";
import TranslationsProductList from "./EntityLists/TranslationsProductList";
import TranslationsSaleList from "./EntityLists/TranslationsSaleList";
import TranslationsShippingMethodList from "./EntityLists/TranslationsShippingMethodList";
import TranslationsVoucherList from "./EntityLists/TranslationsVoucherList";

interface TranslationsEntitiesProps {
    language: string;
    params: LanguageEntitiesUrlQueryParams;
}

const TranslationsEntities: React.FC<TranslationsEntitiesProps> = ({ language, params }) => {
    const navigate = useNavigator();
    const shop = useShop();

    if (Object.keys(TranslatableEntities).indexOf(params.tab) === -1) {
        navigate(
            `?${stringifyQs({
                tab: TranslatableEntities.categories,
            })}`,
            { replace: true }
        );
    }

    const filterCallbacks = {
        onCategoriesTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.categories,
                })}`
            ),
        onCollectionsTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.collections,
                })}`
            ),
        onPagesTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.pages,
                })}`
            ),
        onAttributesTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.attributes,
                })}`
            ),
        onProductsTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.products,
                })}`
            ),
        onSalesTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.sales,
                })}`
            ),
        onShippingMethodsTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.shippingMethods,
                })}`
            ),
        onVouchersTabClick: () =>
            navigate(
                `?${stringifyQs({
                    tab: TranslatableEntities.vouchers,
                })}`
            ),
    };

    const lang = maybe(() =>
        shop?.languages.find((languageFromList) => languageFromList?.code === language)
    );

    const paginationState = createPaginationState(PAGINATE_BY, params);

    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            language: language as any,
        }),
        [params]
    );

    return (
        <TranslationsEntitiesListPage
            filters={{
                current: params.tab,
                ...filterCallbacks,
            }}
            language={lang}
            onBack={() => navigate(languageListUrl)}
        >
            {params.tab === "categories" ? (
                <TranslationsCategoryList params={params} variables={queryVariables} />
            ) : params.tab === "products" ? (
                <TranslationsProductList params={params} variables={queryVariables} />
            ) : params.tab === "collections" ? (
                <TranslationsCollectionList params={params} variables={queryVariables} />
            ) : params.tab === "sales" ? (
                <TranslationsSaleList params={params} variables={queryVariables} />
            ) : params.tab === "vouchers" ? (
                <TranslationsVoucherList params={params} variables={queryVariables} />
            ) : params.tab === "pages" ? (
                <TranslationsPageList params={params} variables={queryVariables} />
            ) : params.tab === "attributes" ? (
                <TranslationsAttributeList params={params} variables={queryVariables} />
            ) : params.tab === "shippingMethods" ? (
                <TranslationsShippingMethodList params={params} variables={queryVariables} />
            ) : null}
        </TranslationsEntitiesListPage>
    );
};

TranslationsEntities.displayName = "TranslationsEntities";

export default TranslationsEntities;
