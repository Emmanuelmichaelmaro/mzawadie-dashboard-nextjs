/* eslint-disable @typescript-eslint/no-floating-promises */
// @ts-nocheck
import { getStringOrPlaceholder, ListViews } from "@mzawadie/core";
import { PermissionGroupErrorFragment } from "@mzawadie/fragments/types/PermissionGroupErrorFragment";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { configurationMenuUrl } from "@mzawadie/views/configuration";
import PermissionGroupDeleteDialog from "@mzawadie/views/permissionGroups/components/PermissionGroupDeleteDialog";
import { usePermissionGroupDelete } from "@mzawadie/views/permissionGroups/mutations";
import { usePermissionGroupListQuery } from "@mzawadie/views/permissionGroups/queries";
import { PermissionGroupDelete } from "@mzawadie/views/permissionGroups/types/PermissionGroupDelete";
import React from "react";
import { useIntl } from "react-intl";

import PermissionGroupListPage from "../../components/PermissionGroupListPage";
import {
    permissionGroupAddUrl,
    permissionGroupDetailsUrl,
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
    const paginate = usePaginator();
    const notify = useNotifier();
    const intl = useIntl();
    const { updateListSettings, settings } = useListSettings(ListViews.STAFF_MEMBERS_LIST);

    const paginationState = createPaginationState(settings.rowNumber, params);
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            sort: getSortQueryVariables(params),
        }),
        [paginationState, params]
    );
    const { data, loading, refetch } = usePermissionGroupListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        data?.permissionGroups.pageInfo,
        paginationState,
        params
    );

    const handleSort = createSortHandler(navigate, permissionGroupListUrl, params);

    const [openModal, closeModal] = createDialogActionHandlers<
        PermissionGroupListUrlDialog,
        PermissionGroupListUrlQueryParams
    >(navigate, permissionGroupListUrl, params);

    const permissionGroups = mapEdgesToItems(data?.permissionGroups);
    const [deleteError, setDeleteError] = React.useState<PermissionGroupErrorFragment>();

    const handleDeleteSuccess = (data: PermissionGroupDelete) => {
        if (data.permissionGroupDelete?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Permission Group Deleted",
                    id: "DovGIa",
                }),
            });
            refetch();
            setDeleteError(undefined);
            closeModal();
        } else {
            setDeleteError(data.permissionGroupDelete?.errors[0]);
        }
    };

    const [permissionGroupDelete] = usePermissionGroupDelete({
        onCompleted: handleDeleteSuccess,
    });
    return (
        <>
            <PermissionGroupListPage
                disabled={loading}
                settings={settings}
                pageInfo={pageInfo}
                sort={getSortParams(params)}
                permissionGroups={permissionGroups}
                onAdd={() => navigate(permissionGroupAddUrl)}
                onBack={() => navigate(configurationMenuUrl)}
                onDelete={(id) => openModal("remove", { id })}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onUpdateListSettings={updateListSettings}
                onRowClick={(id) => () => navigate(permissionGroupDetailsUrl(id))}
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
                confirmButtonState="default"
                open={params.action === "remove"}
                onClose={closeModal}
            />
        </>
    );
};

export default PermissionGroupList;
