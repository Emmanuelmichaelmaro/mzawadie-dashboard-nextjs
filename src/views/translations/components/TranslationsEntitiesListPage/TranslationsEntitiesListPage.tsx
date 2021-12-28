import { Card } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import PageHeader from "@mzawadie/components/PageHeader";
import { ShopInfo_shop_languages } from "@mzawadie/components/Shop/types/ShopInfo";
import FilterTabs, { FilterTab } from "@mzawadie/components/TableFilter";
import { maybe } from "@mzawadie/core";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { TranslatableEntities } from "../../urls";

export interface TranslationsEntitiesListPageProps {
    children: React.ReactNode;
    filters: TranslationsEntitiesFilters;
    language: ShopInfo_shop_languages;
    onBack: () => void;
}

export interface TranslationsEntitiesFilters {
    current: TranslationsEntitiesListFilterTab;
    onCategoriesTabClick: () => void;
    onCollectionsTabClick: () => void;
    onProductsTabClick: () => void;
    onSalesTabClick: () => void;
    onVouchersTabClick: () => void;
    onPagesTabClick: () => void;
    onAttributesTabClick: () => void;
    onShippingMethodsTabClick: () => void;
}

export type TranslationsEntitiesListFilterTab = keyof typeof TranslatableEntities;

const tabs: TranslationsEntitiesListFilterTab[] = [
    "categories",
    "collections",
    "products",
    "sales",
    "vouchers",
    "pages",
    "attributes",
    "shippingMethods",
];

const TranslationsEntitiesListPage: React.FC<TranslationsEntitiesListPageProps> = (props) => {
    const { filters, language, onBack, children } = props;

    const intl = useIntl();
    const queryTab = tabs.indexOf(filters.current);
    const currentTab = queryTab >= 0 ? queryTab : 0;

    return (
        <Container>
            <Backlink onClick={onBack}>
                {intl.formatMessage({
                    defaultMessage: "Languages",
                    id: "GsBRWL",
                })}
            </Backlink>

            <PageHeader
                title={intl.formatMessage(
                    {
                        defaultMessage: "Translations to {language}",
                        id: "FemBUF",
                        description: "header",
                    },
                    {
                        language: maybe(() => language.language, "..."),
                    }
                )}
            />

            <Card>
                <FilterTabs currentTab={currentTab}>
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Categories",
                            id: "VKb1MS",
                        })}
                        onClick={filters.onCategoriesTabClick}
                    />
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Collections",
                            id: "ulh3kf",
                        })}
                        onClick={filters.onCollectionsTabClick}
                    />
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Products",
                            id: "7NFfmz",
                        })}
                        onClick={filters.onProductsTabClick}
                    />
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Sales",
                            id: "c8nvms",
                        })}
                        onClick={filters.onSalesTabClick}
                    />
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Vouchers",
                            id: "etP0+D",
                        })}
                        onClick={filters.onVouchersTabClick}
                    />
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Pages",
                            id: "CxfKLC",
                        })}
                        onClick={filters.onPagesTabClick}
                    />
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Attributes",
                            id: "+xTpT1",
                        })}
                        onClick={filters.onAttributesTabClick}
                    />
                    <FilterTab
                        label={intl.formatMessage({
                            defaultMessage: "Shipping methods",
                            id: "RzsKm8",
                        })}
                        onClick={filters.onShippingMethodsTabClick}
                    />
                </FilterTabs>

                {children}
            </Card>
        </Container>
    );
};

TranslationsEntitiesListPage.displayName = "TranslationsEntitiesListPage";

export default TranslationsEntitiesListPage;
