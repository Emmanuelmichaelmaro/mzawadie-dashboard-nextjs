// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { DeleteFilterTabDialog } from "@mzawadie/components/DeleteFilterTabDialog";
import {
    SaveFilterTabDialogFormData,
    SaveFilterTabDialog,
} from "@mzawadie/components/SaveFilterTabDialog";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, sectionNames } from "@mzawadie/core";
import { maybe } from "@mzawadie/core";
import { ListViews } from "@mzawadie/core";
import { useBulkRemoveCustomersMutation, useListCustomersQuery } from "@mzawadie/graphql";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState, PaginatorContext } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@mzawadie/utils/handlers/filterHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerListPage } from "../../components/CustomerListPage";
import { customerListUrl, CustomerListUrlDialog, CustomerListUrlQueryParams } from "../../urls";
import {
    deleteFilterTab,
    getActiveFilters,
    getFilterOpts,
    getFilterQueryParam,
    getFiltersCurrentTab,
    getFilterTabs,
    getFilterVariables,
    saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface CustomerListProps {
    params: CustomerListUrlQueryParams;
}

export const CustomerList: React.FC<CustomerListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    
    const { updateListSettings, settings } = useListSettings(ListViews.CUSTOMER_LIST);

    usePaginationReset(customerListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const paginationState = createPaginationState(settings.rowNumber, params);
    
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            filter: getFilterVariables(params),
            sort: getSortQueryVariables(params),
        }),
        [params, settings.rowNumber]
    );
    
    const { data, loading, refetch } = useListCustomersQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const tabs = getFilterTabs();

    const currentTab = getFiltersCurrentTab(params, tabs);

    const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
        cleanupFn: reset,
        createUrl: customerListUrl,
        getFilterQueryParam,
        navigate,
        params,
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        CustomerListUrlDialog,
        CustomerListUrlQueryParams
    >(navigate, customerListUrl, params);

    const handleTabChange = (tab: number) => {
        reset();
        navigate(
            customerListUrl({
                activeTab: tab.toString(),
                ...getFilterTabs()[tab - 1].data,
            })
        );
    };

    const handleTabDelete = () => {
        deleteFilterTab(currentTab);
        reset();
        navigate(customerListUrl());
    };

    const handleTabSave = (data: SaveFilterTabDialogFormData) => {
        saveFilterTab(data.name, getActiveFilters(params));
        handleTabChange(tabs.length + 1);
    };

    const paginationValues = usePaginator({
        pageInfo: maybe(() => data?.customers?.pageInfo),
        paginationState,
        queryString: params,
    });

    const [bulkRemoveCustomers, bulkRemoveCustomersOpts] = useBulkRemoveCustomersMutation({
        onCompleted: (data) => {
            if (data.customerBulkDelete?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                reset();
                refetch();
                closeModal();
            }
        },
    });

    const handleSort = createSortHandler(navigate, customerListUrl, params);

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <WindowTitle title={intl.formatMessage(sectionNames.customers)} />

            <CustomerListPage
                currentTab={currentTab}
                filterOpts={getFilterOpts(params)}
                initialSearch={params.query || ""}
                onSearchChange={handleSearchChange}
                onFilterChange={changeFilters}
                onAll={resetFilters}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                tabs={tabs.map((tab) => tab.name)}
                customers={mapEdgesToItems(data?.customers)}
                settings={settings}
                disabled={loading}
                onUpdateListSettings={updateListSettings}
                onSort={handleSort}
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
                isChecked={isSelected}
                selected={listElements.length}
                sort={getSortParams(params)}
                toggle={toggle}
                toggleAll={toggleAll}
            />

            <ActionDialog
                open={params.action === "remove" && maybe(() => params.ids.length > 0)}
                onClose={closeModal}
                confirmButtonState={bulkRemoveCustomersOpts.status}
                onConfirm={() =>
                    bulkRemoveCustomers({
                        variables: {
                            ids: params.ids,
                        },
                    })
                }
                variant="delete"
                title={intl.formatMessage({
                    id: "q8ep2I",
                    defaultMessage: "Delete Customers",
                    description: "dialog header",
                })}
            >
                <DialogContentText>
                    <FormattedMessage
                        id="N2SbNc"
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this customer?} other{Are you sure you want to delete {displayQuantity} customers?}}"
                        values={{
                            counter: maybe(() => params.ids.length),
                            displayQuantity: <strong>{maybe(() => params.ids.length)}</strong>,
                        }}
                    />
                </DialogContentText>
            </ActionDialog>

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

export default CustomerList;
