// @ts-nocheck
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialogFormData,
    SaveFilterTabDialog,
} from "@mzawadie/components/SaveFilterTabDialog";
import { PAGINATE_BY } from "@mzawadie/core";
import { maybe } from "@mzawadie/core";
import { useAttributeBulkDeleteMutation, useAttributeListQuery } from "@mzawadie/graphql";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState, PaginatorContext } from "@mzawadie/hooks/usePaginator";
import {
    deleteFilterTab,
    getActiveFilters,
    getFilterOpts,
    getFiltersCurrentTab,
    getFilterTabs,
    getFilterVariables,
    saveFilterTab,
} from "@mzawadie/pages/attributes/views/AttributeList/filters";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { AttributeBulkDeleteDialog } from "../../components/AttributeBulkDeleteDialog";
import { AttributeListPage } from "../../components/AttributeListPage";
import { attributeListUrl, AttributeListUrlDialog, AttributeListUrlQueryParams } from "../../urls";
import { getFilterQueryParam } from "./filters";
import { getSortQueryVariables } from "./sort";

interface AttributeListProps {
    params: AttributeListUrlQueryParams;
}

const AttributeList: React.FC<AttributeListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const intl = useIntl();

    const paginationState = createPaginationState(PAGINATE_BY, params);

    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [params]
    );

    const { data, loading, refetch } = useAttributeListQuery({
        variables: queryVariables,
    });

    const [attributeBulkDelete, attributeBulkDeleteOpts] = useAttributeBulkDeleteMutation({
        onCompleted: (data) => {
            if (data.attributeBulkDelete?.errors.length === 0) {
                closeModal();
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        id: "lw9WIk",
                        defaultMessage: "Attributes successfully delete",
                        description: "deleted multiple attributes",
                    }),
                });
                reset();
                refetch();
            }
        },
    });

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [openModal, closeModal] = createDialogActionHandlers<
        AttributeListUrlDialog,
        AttributeListUrlQueryParams
    >(navigate, attributeListUrl, params);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: attributeListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            attributeListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(attributeListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const paginationValues = usePaginator({
        pageInfo: maybe(() => data?.attributes?.pageInfo),
        paginationState,
        queryString: params,
    });

    const handleSort = createSortHandler(navigate, attributeListUrl, params);

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <AttributeListPage
                attributes={mapEdgesToItems(data?.attributes)}
                currentTab={currentTab}
                disabled={loading || attributeBulkDeleteOpts.loading}
                filterOpts={getFilterOpts(params)}
                initialSearch={params.query || ""}
                isChecked={isSelected}
                onAll={resetFilters}
                onFilterChange={changeFilters}
                onSearchChange={handleSearchChange}
                onSort={handleSort}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                selected={listElements.length}
                sort={getSortParams(params)}
                tabs={tabs.map((tab) => tab.name)}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={
                    <IconButton
                        variant="secondary"
                        color="primary"
                        onClick={() =>
                            openModal("remove", {
                                ids: listElements,
                            })
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                }
            />

            <AttributeBulkDeleteDialog
                confirmButtonState={attributeBulkDeleteOpts.status}
                open={params.action === "remove" && maybe(() => params.ids.length > 0)}
                onConfirm={() => attributeBulkDelete({ variables: { ids: params.ids } })}
                onClose={closeModal}
                quantity={maybe(() => params.ids.length)}
            />

            <SaveFilterTabDialog
                open={params.action === "save-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabSave}
            />

            <DeleteFilterTabDialog
                open={params.action === "delete-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabDelete}
                tabName={maybe(() => tabs[currentTab - 1].name, "...")}
            />
        </PaginatorContext.Provider>
    );
};

AttributeList.displayName = "AttributeList";

export default AttributeList;
