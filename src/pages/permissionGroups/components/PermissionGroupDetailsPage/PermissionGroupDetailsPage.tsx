// @ts-nocheck
import { AccountPermissions } from "@mzawadie/components/AccountPermissions";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames, ListActions, SortPage } from "@mzawadie/core";
import {
    PermissionGroupErrorFragment,
    PermissionEnum,
    UserPermissionFragment,
    PermissionGroupDetailsFragment,
} from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { MembersListUrlSortField } from "@mzawadie/pages/permissionGroups/urls";
import { extractPermissionCodes, isGroupFullAccess } from "@mzawadie/pages/permissionGroups/utils";
import { getFormErrors } from "@mzawadie/utils/errors";
import getPermissionGroupErrorMessage from "@mzawadie/utils/errors/permissionGroups";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { PermissionGroupInfo } from "../PermissionGroupInfo";
import { PermissionGroupMemberList } from "../PermissionGroupMemberList";

export interface PermissionGroupDetailsPageFormData {
    name: string;
    hasFullAccess: boolean;
    isActive: boolean;
    permissions: PermissionEnum[];
    users: PermissionGroupDetailsFragment["users"];
}

export interface PermissionData extends Omit<UserPermissionFragment, "__typename"> {
    lastSource?: boolean;
    disabled?: boolean;
}

export interface PermissionGroupDetailsPageProps
    extends ListActions,
        SortPage<MembersListUrlSortField> {
    disabled: boolean;
    errors: PermissionGroupErrorFragment[];
    members: PermissionGroupDetailsFragment["users"];
    membersModified: boolean;
    permissionGroup: PermissionGroupDetailsFragment;
    permissions: PermissionData[];
    permissionsExceeded: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onAssign: () => void;
    onBack: () => void;
    onUnassign: (ids: string[]) => void;
    onSubmit: (data: PermissionGroupDetailsPageFormData) => SubmitPromise;
}

const PermissionGroupDetailsPage: React.FC<PermissionGroupDetailsPageProps> = ({
    disabled,
    errors,
    members,
    membersModified,
    onBack,
    onSubmit,
    permissionGroup,
    permissions,
    permissionsExceeded,
    saveButtonBarState,
    ...listProps
}) => {
    const intl = useIntl();

    const initialForm: PermissionGroupDetailsPageFormData = {
        hasFullAccess: isGroupFullAccess(permissionGroup, permissions),
        isActive: false,
        name: permissionGroup?.name || "",
        permissions: extractPermissionCodes(permissionGroup),
        users: members,
    };

    const formErrors = getFormErrors(["addPermissions"], errors);
    const permissionsError = getPermissionGroupErrorMessage(formErrors.addPermissions, intl);

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
            {({ data, change, submit, hasChanged }) => (
                <Container>
                    <Backlink onClick={onBack}>
                        {intl.formatMessage(sectionNames.permissionGroups)}
                    </Backlink>
                    <PageHeader title={permissionGroup?.name} />

                    <Grid>
                        <div>
                            <PermissionGroupInfo
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                onChange={change}
                            />
                            <FormSpacer />
                            <PermissionGroupMemberList
                                disabled={disabled}
                                {...listProps}
                                users={data?.users || []}
                            />
                        </div>
                        <div>
                            <AccountPermissions
                                permissionsExceeded={permissionsExceeded}
                                data={data}
                                disabled={disabled}
                                permissions={permissions}
                                onChange={change}
                                errorMessage={permissionsError}
                                fullAccessLabel={intl.formatMessage({
                                    defaultMessage: "Group has full access to the store",
                                    id: "mAabef",
                                    description: "checkbox label",
                                })}
                                description={intl.formatMessage({
                                    defaultMessage:
                                        "Expand or restrict group's permissions to access certain part of mzawadie system.",
                                    id: "YjwDaY",
                                    description: "card description",
                                })}
                            />
                        </div>
                    </Grid>
                    <div>
                        <Savebar
                            onCancel={onBack}
                            onSubmit={submit}
                            state={saveButtonBarState}
                            disabled={disabled || !(hasChanged || membersModified)}
                        />
                    </div>
                </Container>
            )}
        </Form>
    );
};

PermissionGroupDetailsPage.displayName = "PermissionGroupDetailsPage";

export default PermissionGroupDetailsPage;
