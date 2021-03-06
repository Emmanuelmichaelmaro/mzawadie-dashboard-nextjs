/* eslint-disable @typescript-eslint/no-floating-promises */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button } from "@material-ui/core";
import { DEFAULT_INITIAL_SEARCH_DATA, commonMessages } from "@mzawadie/core";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import useUser from "@mzawadie/hooks/useUser";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import MembersErrorDialog from "@mzawadie/views/permissionGroups/components/MembersErrorDialog";
import {
    arePermissionsExceeded,
    permissionsDiff,
    usersDiff,
} from "@mzawadie/views/permissionGroups/utils";
import useStaffMemberSearch from "@mzawadie/views/searches/useStaffMemberSearch";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import AssignMembersDialog from "../../components/AssignMembersDialog";
import PermissionGroupDetailsPage, {
    PermissionGroupDetailsPageFormData,
} from "../../components/PermissionGroupDetailsPage";
import UnassignMembersDialog from "../../components/UnassignMembersDialog";
import { usePermissionGroupUpdate } from "../../mutations";
import { usePermissionGroupDetailsQuery } from "../../queries";
import { PermissionGroupUpdate } from "../../types/PermissionGroupUpdate";
import {
    permissionGroupDetailsUrl,
    PermissionGroupDetailsUrlDialog,
    PermissionGroupDetailsUrlQueryParams,
    permissionGroupListUrl,
} from "../../urls";

interface PermissionGroupDetailsProps {
    id: string;
    params: PermissionGroupDetailsUrlQueryParams;
}

export const PermissionGroupDetails: React.FC<PermissionGroupDetailsProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const shop = useShop();
    const notify = useNotifier();
    const intl = useIntl();
    const user = useUser();

    const { data, loading, refetch } = usePermissionGroupDetailsQuery({
        displayLoader: true,
        variables: { id, userId: user?.user?.id },
    });

    const [membersList, setMembersList] = useStateFromProps(data?.permissionGroup.users);

    const [membersModified, setMembersModified] = useState(false);

    const {
        search,
        result: searchResult,
        loadMore,
    } = useStaffMemberSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const handleUpdateSuccess = (data: PermissionGroupUpdate) => {
        if (data.permissionGroupUpdate?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            refetch();
            closeModal();
        } else if (data.permissionGroupUpdate?.errors.some((e) => e.field === "removeUsers")) {
            openModal("unassignError");
        }
    };

    const { isSelected, listElements, toggle, toggleAll } = useBulkActions(params.ids);

    const [permissionGroupUpdate, permissionGroupUpdateResult] = usePermissionGroupUpdate({
        onCompleted: handleUpdateSuccess,
    });

    const [openModal, closeModal] = createDialogActionHandlers<
        PermissionGroupDetailsUrlDialog,
        PermissionGroupDetailsUrlQueryParams
    >(navigate, (params) => permissionGroupDetailsUrl(id, params), params);

    const handleSort = createSortHandler(
        navigate,
        (params) => permissionGroupDetailsUrl(id, params),
        params
    );

    const unassignMembers = () => {
        setMembersList(membersList?.filter((m: any) => !listElements.includes(m.id)));
        setMembersModified(true);
        closeModal();
    };

    const isGroupEditable = (data?.user.editableGroups || []).filter((g) => g.id === id).length > 0;

    const lastSourcesOfPermission = (data?.user.userPermissions || [])
        .filter(
            (perm: any) =>
                perm.sourcePermissionGroups.length === 1 && perm.sourcePermissionGroups[0].id === id
        )
        .map((perm: any) => perm.code);

    const userPermissions = user?.user?.userPermissions?.map((p) => p.code) || [];

    const permissions = (shop?.permissions || []).map((perm) => ({
        ...perm,
        disabled: !userPermissions.includes(perm?.code as PermissionEnum),
        lastSource: lastSourcesOfPermission.includes(perm?.code),
    }));

    const permissionsExceeded = arePermissionsExceeded(data?.permissionGroup, user.user);
    const disabled = loading || !isGroupEditable || permissionsExceeded;

    const handleSubmit = async (formData: PermissionGroupDetailsPageFormData) => {
        const result = await permissionGroupUpdate({
            variables: {
                id,
                input: {
                    name: formData.name,
                    ...permissionsDiff(data?.permissionGroup, formData),
                    ...usersDiff(data?.permissionGroup, formData),
                },
            },
        });

        return result.data.permissionGroupUpdate.errors;
    };

    return (
        <>
            <PermissionGroupDetailsPage
                permissionGroup={data?.permissionGroup}
                permissionsExceeded={permissionsExceeded}
                members={membersList || []}
                membersModified={membersModified}
                onBack={() => navigate(permissionGroupListUrl())}
                onAssign={() => openModal("assign")}
                onUnassign={(ids) => openModal("unassign", { ids })}
                errors={permissionGroupUpdateResult?.data?.permissionGroupUpdate.errors || []}
                onSubmit={handleSubmit}
                permissions={permissions}
                saveButtonBarState={permissionGroupUpdateResult.status}
                disabled={disabled}
                toggle={toggle}
                toggleAll={toggleAll}
                isChecked={isSelected}
                selected={listElements.length}
                sort={getSortParams(params)}
                toolbar={
                    <Button
                        color="primary"
                        onClick={() => openModal("unassign", { ids: listElements })}
                    >
                        {intl.formatMessage({
                            defaultMessage: "Unassign",
                            id: "15PiOX",
                            description: "button title",
                        })}
                    </Button>
                }
                onSort={handleSort}
            />
            <AssignMembersDialog
                loading={searchResult.loading}
                staffMembers={mapEdgesToItems(searchResult?.data?.search)}
                onSearchChange={search}
                onFetchMore={loadMore}
                disabled={disabled}
                hasMore={searchResult?.data?.search.pageInfo.hasNextPage}
                initialSearch=""
                confirmButtonState={permissionGroupUpdateResult.status}
                open={params.action === "assign"}
                onClose={closeModal}
                onSubmit={(formData) => {
                    setMembersList([
                        ...membersList,
                        ...formData.filter((member) => !membersList.includes(member)),
                    ]);
                    setMembersModified(true);
                    closeModal();
                }}
            />
            <UnassignMembersDialog
                onConfirm={unassignMembers}
                confirmButtonState={permissionGroupUpdateResult.status}
                quantity={listElements.length}
                open={params.action === "unassign"}
                onClose={closeModal}
            />
            <MembersErrorDialog
                onConfirm={closeModal}
                confirmButtonState={permissionGroupUpdateResult.status}
                open={params.action === "unassignError"}
                onClose={closeModal}
            />
        </>
    );
};

export default PermissionGroupDetails;
