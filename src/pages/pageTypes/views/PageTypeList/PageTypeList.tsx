/* eslint-disable radix */
// @ts-nocheck
import { IconButton } from "@material-ui/core";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialog,
    SaveFilterTabDialogFormData,
} from "@mzawadie/components/SaveFilterTabDialog";
import { TypeDeleteWarningDialog } from "@mzawadie/components/TypeDeleteWarningDialog";
import { commonMessages, getStringOrPlaceholder, ListViews } from "@mzawadie/core";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { usePageTypeDelete } from "@mzawadie/pages/pageTypes/hooks/usePageTypeDelete";
import { usePageTypeBulkDeleteMutation } from "@mzawadie/pages/pageTypes/mutations";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { DeleteIcon } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { PageTypeListPage } from "../../components/PageTypeListPage";
import { usePageTypeListQuery } from "../../queries";
import {
    pageTypeAddUrl,
    pageTypeListUrl,
    PageTypeListUrlDialog,
    PageTypeListUrlFilters,
    PageTypeListUrlQueryParams,
    pageTypeUrl,
} from "../../urls";
import {
    areFiltersApplied,
    deleteFilterTab,
    getActiveFilters,
    getFilterTabs,
    getFilterVariables,
    saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface PageTypeListProps {
    params: PageTypeListUrlQueryParams;
}

export const PageTypeList: React.FC<PageTypeListProps> = ({ params }) => {
    const navigate = useNavigator();
    const paginate = usePaginator();
    const notify = useNotifier();
    const {
        isSelected,
        listElements: selectedPageTypes,
        reset,
        toggle,
        toggleAll,
    } = useBulkActions(params.ids);
    const intl = useIntl();
    const { settings } = useListSettings(ListViews.PAGES_LIST);

    const paginationState = createPaginationState(settings.rowNumber, params);
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [params]
    );
    const { data, loading, refetch } = usePageTypeListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const tabs = getFilterTabs();

    const currentTab =
        params.activeTab === undefined
            ? areFiltersApplied(params)
                ? tabs.length + 1
                : 0
            : parseInt(params.activeTab, 0);

    const changeFilterField = (filter: PageTypeListUrlFilters) => {
        reset();
        navigate(
            pageTypeListUrl({
                ...getActiveFilters(params),
                ...filter,
                activeTab: undefined,
            })
        );
    };

    const [openModal, closeModal] = createDialogActionHandlers<
        PageTypeListUrlDialog,
        PageTypeListUrlQueryParams
    >(navigate, pageTypeListUrl, params);

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            pageTypeListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(pageTypeListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        data?.pageTypes?.pageInfo,
        paginationState,
        params
    );

    const handleSort = createSortHandler(navigate, pageTypeListUrl, params);

    const [pageTypeBulkDelete, pageTypeBulkDeleteOpts] = usePageTypeBulkDeleteMutation({
        onCompleted: (data) => {
            if (data.pageTypeBulkDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                reset();
                refetch();
                navigate(
                    pageTypeListUrl({
                        ...params,
                        action: undefined,
                        ids: undefined,
                    })
                );
            }
        },
    });

    const hanldePageTypeBulkDelete = () =>
        pageTypeBulkDelete({
            variables: {
                ids: params.ids,
            },
        });

    const pageTypeDeleteData = usePageTypeDelete({
        selectedTypes: selectedPageTypes,
        params,
    });

    const pageTypesData = mapEdgesToItems(data?.pageTypes);

    return (
        <>
            <PageTypeListPage
                currentTab={currentTab}
                initialSearch={params.query || ""}
                onSearchChange={(query) => changeFilterField({ query })}
                onAll={() => navigate(pageTypeListUrl())}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                tabs={tabs.map((tab) => tab.name)}
                disabled={loading}
                pageTypes={pageTypesData}
                pageInfo={pageInfo}
                onAdd={() => navigate(pageTypeAddUrl)}
                onBack={() => navigate(configurationMenuUrl)}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onRowClick={(id) => () => navigate(pageTypeUrl(id))}
                onSort={handleSort}
                isChecked={isSelected}
                selected={selectedPageTypes.length}
                sort={getSortParams(params)}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={
                    <IconButton
                        color="primary"
                        onClick={() =>
                            openModal("remove", {
                                ids: selectedPageTypes,
                            })
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                }
            />
            {pageTypesData && (
                <TypeDeleteWarningDialog
                    {...pageTypeDeleteData}
                    typesData={pageTypesData}
                    typesToDelete={selectedPageTypes}
                    onClose={closeModal}
                    onDelete={hanldePageTypeBulkDelete}
                    deleteButtonState={pageTypeBulkDeleteOpts.status}
                    showViewAssignedItemsButton={false}
                />
            )}
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
                tabName={getStringOrPlaceholder(tabs[currentTab - 1]?.name)}
            />
        </>
    );
};

PageTypeList.displayName = "PageTypeList";

export default PageTypeList;
