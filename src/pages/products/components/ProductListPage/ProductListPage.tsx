// @ts-nocheck
import { Card } from "@material-ui/core";
import { ButtonWithSelect } from "@mzawadie/components/ButtonWithSelect";
import { CardMenu } from "@mzawadie/components/CardMenu";
import { ColumnPicker, ColumnPickerChoice } from "@mzawadie/components/ColumnPicker";
import Container from "@mzawadie/components/Container";
import { getByName } from "@mzawadie/components/Filter/utils";
import { FilterBar } from "@mzawadie/components/FilterBar";
import LimitReachedAlert from "@mzawadie/components/LimitReachedAlert";
import { PageHeader } from "@mzawadie/components/PageHeader";
import {
    ProductListColumns,
    sectionNames,
    ChannelProps,
    FetchMoreProps,
    FilterPageProps,
    ListActions,
    PageListProps,
    SortPage,
    RelayToFlat,
} from "@mzawadie/core";
import {
    AvailableInGridAttributesQuery,
    GridAttributesQuery,
    ProductListQuery,
    RefreshLimitsQuery,
} from "@mzawadie/graphql";
import {
    extensionMountPoints,
    mapToMenuItems,
    useExtensions,
} from "@mzawadie/pages/apps/useExtensions";
import { hasLimits, isLimitReached } from "@mzawadie/utils/limits";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductListUrlSortField } from "../../urls";
import { ProductList } from "../ProductList";
import { columnsMessages } from "../ProductList/messages";
import { createFilterStructure, ProductFilterKeys, ProductListFilterOpts } from "./filters";

export interface ProductListPageProps
    extends PageListProps<ProductListColumns>,
        ListActions,
        FilterPageProps<ProductFilterKeys, ProductListFilterOpts>,
        FetchMoreProps,
        SortPage<ProductListUrlSortField>,
        ChannelProps {
    activeAttributeSortId: string;
    availableInGridAttributes: RelayToFlat<AvailableInGridAttributesQuery["availableInGrid"]>;
    channelsCount: number;
    currencySymbol: string;
    gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
    limits: RefreshLimitsQuery["shop"]["limits"];
    totalGridAttributes: number;
    products: RelayToFlat<ProductListQuery["products"]>;
    onExport: () => void;
}

const useStyles = makeStyles(
    (theme) => ({
        columnPicker: {
            marginRight: theme.spacing(3),
            [theme.breakpoints.down("xs")]: {
                "& > button": {
                    width: "100%",
                },
            },
        },
        settings: {
            [theme.breakpoints.up("sm")]: {
                marginRight: theme.spacing(2),
            },
        },
    }),
    { name: "ProductListPage" }
);

export const ProductListPage: React.FC<ProductListPageProps> = (props) => {
    const {
        channelsCount,
        currencySymbol,
        currentTab,
        defaultSettings,
        gridAttributes,
        limits,
        availableInGridAttributes,
        filterOpts,
        hasMore,
        initialSearch,
        loading,
        settings,
        tabs,
        totalGridAttributes,
        onAdd,
        onAll,
        onExport,
        onFetchMore,
        onFilterChange,
        onFilterAttributeFocus,
        onSearchChange,
        onTabChange,
        onTabDelete,
        onTabSave,
        onUpdateListSettings,
        selectedChannelId,
        ...listProps
    } = props;

    const intl = useIntl();

    const classes = useStyles(props);

    const handleSave = (columns: ProductListColumns[]) => onUpdateListSettings("columns", columns);

    const filterStructure = createFilterStructure(intl, filterOpts);

    const filterDependency = filterStructure.find(getByName("channel"));

    const columns: ColumnPickerChoice[] = [
        {
            label: intl.formatMessage(columnsMessages.price),
            value: "price" as ProductListColumns,
        },
        {
            label: intl.formatMessage(columnsMessages.type),
            value: "productType" as ProductListColumns,
        },
        {
            label: intl.formatMessage(columnsMessages.updatedAt),
            value: "date" as ProductListColumns,
        },
        ...availableInGridAttributes.map((attribute) => ({
            label: attribute.name,
            value: `attribute:${attribute.id}`,
        })),
    ];

    const limitReached = isLimitReached(limits, "productVariants");

    const { PRODUCT_OVERVIEW_CREATE, PRODUCT_OVERVIEW_MORE_ACTIONS } = useExtensions(
        extensionMountPoints.PRODUCT_LIST
    );

    const extensionMenuItems = mapToMenuItems(PRODUCT_OVERVIEW_MORE_ACTIONS);
    const extensionCreateButtonItems = mapToMenuItems(PRODUCT_OVERVIEW_CREATE);

    return (
        <Container>
            <PageHeader
                cardMenu={
                    <CardMenu
                        className={classes.settings}
                        menuItems={[
                            {
                                label: intl.formatMessage({
                                    defaultMessage: "Export Products",
                                    id: "7FL+WZ",
                                    description: "export products to csv file, button",
                                }),
                                onSelect: onExport,
                                testId: "export",
                            },
                            ...extensionMenuItems,
                        ]}
                        data-test-id="menu"
                    />
                }
                title={intl.formatMessage(sectionNames.products)}
                limitText={
                    hasLimits(limits, "productVariants") &&
                    intl.formatMessage(
                        {
                            defaultMessage: "{count}/{max} SKUs used",
                            id: "Kw0jHS",
                            description: "created products counter",
                        },
                        {
                            count: limits.currentUsage.productVariants,
                            max: limits.allowedUsage.productVariants,
                        }
                    )
                }
            >
                <ColumnPicker
                    className={classes.columnPicker}
                    columns={columns}
                    defaultColumns={defaultSettings.columns}
                    hasMore={hasMore}
                    initialColumns={settings.columns}
                    total={columns.length - availableInGridAttributes.length + totalGridAttributes}
                    onFetchMore={onFetchMore}
                    onSave={handleSave}
                />

                <ButtonWithSelect
                    options={extensionCreateButtonItems}
                    data-test-id="add-product"
                    disabled={limitReached}
                    onClick={onAdd}
                >
                    <FormattedMessage
                        defaultMessage="Create Product"
                        id="JFmOfi"
                        description="button"
                    />
                </ButtonWithSelect>
            </PageHeader>

            {limitReached && (
                <LimitReachedAlert
                    title={intl.formatMessage({
                        defaultMessage: "SKU limit reached",
                        id: "FwHWUm",
                        description: "alert",
                    })}
                >
                    <FormattedMessage
                        defaultMessage="You have reached your SKU limit, you will be no longer able to add SKUs to your store. If you would like to up your limit, contact your administration staff about raising your limits."
                        id="5Vwnu+"
                    />
                </LimitReachedAlert>
            )}

            <Card>
                <FilterBar
                    currencySymbol={currencySymbol}
                    currentTab={currentTab}
                    initialSearch={initialSearch}
                    onAll={onAll}
                    onFilterChange={onFilterChange}
                    onFilterAttributeFocus={onFilterAttributeFocus}
                    onSearchChange={onSearchChange}
                    onTabChange={onTabChange}
                    onTabDelete={onTabDelete}
                    onTabSave={onTabSave}
                    tabs={tabs}
                    allTabLabel={intl.formatMessage({
                        defaultMessage: "All Products",
                        id: "aFLtLk",
                        description: "tab name",
                    })}
                    filterStructure={filterStructure}
                    searchPlaceholder={intl.formatMessage({
                        defaultMessage: "Search Products...",
                        id: "kIvvax",
                    })}
                />

                <ProductList
                    {...listProps}
                    loading={loading}
                    gridAttributes={gridAttributes}
                    settings={settings}
                    selectedChannelId={selectedChannelId}
                    onUpdateListSettings={onUpdateListSettings}
                    filterDependency={filterDependency}
                />
            </Card>
        </Container>
    );
};

ProductListPage.displayName = "ProductListPage";

export default ProductListPage;
