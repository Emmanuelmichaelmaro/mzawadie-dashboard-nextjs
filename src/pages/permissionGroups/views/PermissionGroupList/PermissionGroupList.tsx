// @ts-nocheck
import { getStringOrPlaceholder } from "@mzawadie/core";
import { ListViews } from "@mzawadie/core";
import {
    PermissionGroupErrorFragment,
    usePermissionGroupDeleteMutation,
    usePermissionGroupListQuery,
} from "@mzawadie/graphql";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState, PaginatorContext } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import { PermissionGroupDeleteDialog } from "../../components/PermissionGroupDeleteDialog";
import { PermissionGroupListPage } from "../../components/PermissionGroupListPage";
import {
    permissionGroupListUrl,
    PermissionGroupListUrlDialog,
    PermissionGroupListUrlQueryParams,
} from "../../urls";
import { getSortQueryVariables } from "./sort";

interface PermissionGroupListProps {
    params: PermissionGroupListUrlQueryParams;
}

export const PermissionGroupList: React.FC<PermissionGroupListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    
    const { updateListSettings, settings } = useListSettings(ListViews.STAFF_MEMBERS_LIST);

    usePaginationReset(permissionGroupListUrl, params, settings.rowNumber);

    const paginationState = createPaginationState(settings.rowNumber, params);
    
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            sort: getSortQueryVariables(params),
        }),
        [params, settings.rowNumber]
    );
    
    const { data, loading, refetch } = usePermissionGroupListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const paginationValues = usePaginator({
        pageInfo: data?.permissionGroups?.pageInfo,
        paginationState,
        queryString: params,
    });

    const handleSort = createSortHandler(navigate, permissionGroupListUrl, params);

    const [openModal, closeModal] = createDialogActionHandlers<
        PermissionGroupListUrlDialog,
        PermissionGroupListUrlQueryParams
    >(navigate, permissionGroupListUrl, params);

    const permissionGroups = mapEdgesToItems(data?.permissionGroups);
    
    const [deleteError, setDeleteError] = React.useState<PermissionGroupErrorFragment>();

    const [permissionGroupDelete] = usePermissionGroupDeleteMutation({
        onCompleted: (data) => {
            if (data.permissionGroupDelete?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        id: "DovGIa",
                        defaultMessage: "Permission Group Deleted",
                    }),
                });
                refetch();
                setDeleteError(undefined);
                closeModal();
            } else {
                setDeleteError(data.permissionGroupDelete?.errors[0]);
            }
        },
    });

    return (
        <PaginatorContext.Provider value={paginationValues}>
            <PermissionGroupListPage
                disabled={loading}
                settings={settings}
                sort={getSortParams(params)}
                permissionGroups={permissionGroups}
                onDelete={(id) => openModal("remove", { id })}
                onUpdateListSettings={updateListSettings}
                onSort={handleSort}
            />

            <PermissionGroupDeleteDialog
                onConfirm={() =>
                    permissionGroupDelete({
                        variables: {
                            id: params.id,
                        },
                    })
                }
                error={deleteError}
                name={getStringOrPlaceholder(
                    permissionGroups?.find((group) => group.id === params.id)?.name
                )}
                confirmButtonState={"default"}
                open={params.action === "remove"}
                onClose={closeModal}
            />
        </PaginatorContext.Provider>
    );
};

export default PermissionGroupList;
