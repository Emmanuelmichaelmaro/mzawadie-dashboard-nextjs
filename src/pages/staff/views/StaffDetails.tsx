// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import {
    DEFAULT_INITIAL_SEARCH_DATA,
    commonMessages,
    errorMessages,
    extractMutationErrors,
    getStringOrPlaceholder,
    maybe,
} from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { useUser } from "@mzawadie/pages/auth";
import usePermissionGroupSearch from "@mzawadie/searches/usePermissionGroupSearch";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    StaffDetailsPage,
    StaffDetailsFormData,
} from "../components/StaffDetailsPage";
import { StaffPasswordResetDialog } from "../components/StaffPasswordResetDialog";
import {
    TypedStaffAvatarDeleteMutation,
    TypedStaffAvatarUpdateMutation,
    TypedStaffMemberDeleteMutation,
    useChangeStaffPassword,
    useStaffMemberUpdateMutation,
} from "../mutations";
import { TypedStaffMemberDetailsQuery } from "../queries";
import { ChangeStaffPassword } from "../types/ChangeStaffPassword";
import { StaffAvatarDelete } from "../types/StaffAvatarDelete";
import { StaffAvatarUpdate } from "../types/StaffAvatarUpdate";
import { StaffMemberDelete } from "../types/StaffMemberDelete";
import { StaffMemberUpdate } from "../types/StaffMemberUpdate";
import { staffListUrl, staffMemberDetailsUrl, StaffMemberDetailsUrlQueryParams } from "../urls";
import { groupsDiff } from "../utils";

interface OrderListProps {
    id: string;
    params: StaffMemberDetailsUrlQueryParams;
}

export const StaffDetails: React.FC<OrderListProps> = ({ id, params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const user = useUser();
    const intl = useIntl();

    const closeModal = () =>
        navigate(
            staffMemberDetailsUrl(id, {
                ...params,
                action: undefined,
            })
        );

    const handleChangePassword = (data: ChangeStaffPassword) => {
        if (data.passwordChange.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            closeModal();
        }
    };
    const [changePassword, changePasswordOpts] = useChangeStaffPassword({
        onCompleted: handleChangePassword,
    });

    const handleBack = () => navigate(staffListUrl());

    const {
        loadMore: loadMorePermissionGroups,
        search: searchPermissionGroups,
        result: searchPermissionGroupsOpts,
    } = usePermissionGroupSearch({
        variables: DEFAULT_INITIAL_SEARCH_DATA,
    });

    const handleStaffMemberUpdateComplete = (data: StaffMemberUpdate) => {
        if (!maybe(() => data.staffUpdate.errors.length !== 0)) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
        }
    };

    const [updateStaffMember, updateStaffMemberOpts] = useStaffMemberUpdateMutation({
        onCompleted: handleStaffMemberUpdateComplete,
    });

    return (
        <TypedStaffMemberDetailsQuery displayLoader variables={{ id }}>
            {({ data, loading, refetch }) => {
                const staffMember = data?.user;

                if (staffMember === null) {
                    return <NotFoundPage onBack={handleBack} />;
                }

                const handleStaffMemberDelete = (data: StaffMemberDelete) => {
                    if (!maybe(() => data.staffDelete.errors.length !== 0)) {
                        notify({
                            status: "success",
                            text: intl.formatMessage(commonMessages.savedChanges),
                        });
                        navigate(staffListUrl());
                    }
                };

                const handleStaffMemberAvatarUpdate = (data: StaffAvatarUpdate) => {
                    if (!maybe(() => data.userAvatarUpdate.errors.length !== 0)) {
                        notify({
                            status: "success",
                            text: intl.formatMessage(commonMessages.savedChanges),
                        });
                        refetch();
                    } else {
                        notify({
                            status: "error",
                            title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
                            text: intl.formatMessage(errorMessages.imageUploadErrorText),
                        });
                    }
                };

                const handleStaffMemberAvatarDelete = (data: StaffAvatarDelete) => {
                    if (!maybe(() => data.userAvatarDelete.errors.length !== 0)) {
                        notify({
                            status: "success",
                            text: intl.formatMessage(commonMessages.savedChanges),
                        });
                        navigate(staffMemberDetailsUrl(id));
                        refetch();
                    }
                };

                const handleUpdate = (formData: StaffDetailsFormData) =>
                    extractMutationErrors(
                        updateStaffMember({
                            variables: {
                                id,
                                input: {
                                    email: formData.email,
                                    firstName: formData.firstName,
                                    isActive: formData.isActive,
                                    lastName: formData.lastName,
                                    ...groupsDiff(data?.user, formData),
                                },
                            },
                        })
                    );

                // return (
                // <TypedStaffMemberUpdateMutation onCompleted={handleStaffMemberUpdate}>
                // {(updateStaffMember, updateResult) => {

                return (
                    <TypedStaffMemberDeleteMutation
                        variables={{ id }}
                        onCompleted={handleStaffMemberDelete}
                    >
                        {(deleteStaffMember, deleteResult) => (
                            <TypedStaffAvatarUpdateMutation onCompleted={handleStaffMemberAvatarUpdate}>
                                {(updateStaffAvatar) => (
                                    <TypedStaffAvatarDeleteMutation
                                        onCompleted={handleStaffMemberAvatarDelete}
                                    >
                                        {(deleteStaffAvatar, deleteAvatarResult) => {
                                            const isUserSameAsViewer = user.user?.id === data?.user?.id;

                                            return (
                                                <>
                                                    <WindowTitle
                                                        title={getStringOrPlaceholder(
                                                            staffMember?.email
                                                        )}
                                                    />
                                                    <StaffDetailsPage
                                                        errors={
                                                            updateStaffMemberOpts?.data?.staffUpdate
                                                                ?.errors || []
                                                        }
                                                        canEditAvatar={isUserSameAsViewer}
                                                        canEditPreferences={isUserSameAsViewer}
                                                        canEditStatus={!isUserSameAsViewer}
                                                        canRemove={!isUserSameAsViewer}
                                                        disabled={loading}
                                                        onBack={handleBack}
                                                        initialSearch=""
                                                        onChangePassword={() =>
                                                            navigate(
                                                                staffMemberDetailsUrl(id, {
                                                                    action: "change-password",
                                                                })
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            navigate(
                                                                staffMemberDetailsUrl(id, {
                                                                    action: "remove",
                                                                })
                                                            )
                                                        }
                                                        onSubmit={handleUpdate}
                                                        onImageUpload={(file) =>
                                                            updateStaffAvatar({
                                                                variables: {
                                                                    image: file,
                                                                },
                                                            })
                                                        }
                                                        onImageDelete={() =>
                                                            navigate(
                                                                staffMemberDetailsUrl(id, {
                                                                    action: "remove-avatar",
                                                                })
                                                            )
                                                        }
                                                        availablePermissionGroups={mapEdgesToItems(
                                                            searchPermissionGroupsOpts?.data?.search
                                                        )}
                                                        staffMember={staffMember}
                                                        saveButtonBarState={
                                                            updateStaffMemberOpts.status
                                                        }
                                                        fetchMorePermissionGroups={{
                                                            hasMore:
                                                                searchPermissionGroupsOpts.data?.search
                                                                    .pageInfo.hasNextPage,
                                                            loading: searchPermissionGroupsOpts.loading,
                                                            onFetchMore: loadMorePermissionGroups,
                                                        }}
                                                        onSearchChange={searchPermissionGroups}
                                                    />
                                                    <ActionDialog
                                                        open={params.action === "remove"}
                                                        title={intl.formatMessage({
                                                            defaultMessage: "delete Staff User",
                                                            id: "GhXwO/",
                                                            description: "dialog header",
                                                        })}
                                                        confirmButtonState={deleteResult.status}
                                                        variant="delete"
                                                        onClose={closeModal}
                                                        onConfirm={deleteStaffMember}
                                                    >
                                                        <DialogContentText>
                                                            <FormattedMessage
                                                                defaultMessage="Are you sure you want to delete {email} from staff members?"
                                                                id="gxPjIQ"
                                                                values={{
                                                                    email: getStringOrPlaceholder(
                                                                        data?.user?.email
                                                                    ),
                                                                }}
                                                            />
                                                        </DialogContentText>
                                                    </ActionDialog>
                                                    <ActionDialog
                                                        open={params.action === "remove-avatar"}
                                                        title={intl.formatMessage({
                                                            defaultMessage: "Delete Staff User Avatar",
                                                            id: "VKWPBf",
                                                            description: "dialog header",
                                                        })}
                                                        confirmButtonState={deleteAvatarResult.status}
                                                        variant="delete"
                                                        onClose={closeModal}
                                                        onConfirm={deleteStaffAvatar}
                                                    >
                                                        <DialogContentText>
                                                            <FormattedMessage
                                                                defaultMessage="Are you sure you want to remove {email} avatar?"
                                                                id="fzpXvv"
                                                                values={{
                                                                    email: (
                                                                        <strong>
                                                                            {getStringOrPlaceholder(
                                                                                data?.user?.email
                                                                            )}
                                                                        </strong>
                                                                    ),
                                                                }}
                                                            />
                                                        </DialogContentText>
                                                    </ActionDialog>
                                                    <StaffPasswordResetDialog
                                                        confirmButtonState={changePasswordOpts.status}
                                                        errors={
                                                            changePasswordOpts?.data?.passwordChange
                                                                ?.errors || []
                                                        }
                                                        open={params.action === "change-password"}
                                                        onClose={closeModal}
                                                        onSubmit={(data) =>
                                                            changePassword({
                                                                variables: data,
                                                            })
                                                        }
                                                    />
                                                </>
                                            );
                                        }}
                                    </TypedStaffAvatarDeleteMutation>
                                )}
                            </TypedStaffAvatarUpdateMutation>
                        )}
                    </TypedStaffMemberDeleteMutation>
                );
            }}
        </TypedStaffMemberDetailsQuery>
    );
};

export default StaffDetails;