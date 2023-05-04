// @ts-nocheck
import { AccountPermissions } from "@mzawadie/components/AccountPermissions";
import { Backlink } from "@mzawadie/components/Backlink";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import FormSpacer from "@mzawadie/components/FormSpacer";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { ListActions, SortPage } from "@mzawadie/core";
import {
    PermissionEnum,
    PermissionGroupDetailsFragment,
    PermissionGroupErrorFragment,
    UserPermissionFragment,
} from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { MembersListUrlSortField, permissionGroupListUrl } from "@mzawadie/pages/permissionGroups/urls";
import { extractPermissionCodes, isGroupFullAccess } from "@mzawadie/pages/permissionGroups/utils";
import { getFormErrors } from "@mzawadie/utils/errors";
import getPermissionGroupErrorMessage from "@mzawadie/utils/errors/permissionGroups";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
    permissionGroup: PermissionGroupDetailsFragment;
    permissions: PermissionData[];
    permissionsExceeded: boolean;
    saveButtonBarState: ConfirmButtonTransitionState;
    onAssign: () => void;
    onUnassign: (ids: string[]) => void;
    onSubmit: (data: PermissionGroupDetailsPageFormData) => SubmitPromise;
}

const PermissionGroupDetailsPage: React.FC<PermissionGroupDetailsPageProps> = ({
    disabled,
    errors,
    members,
    onSubmit,
    permissionGroup,
    permissions,
    permissionsExceeded,
    saveButtonBarState,
    ...listProps
}) => {
    const intl = useIntl();
    
    const navigate = useNavigator();

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
            {({ data, change, submit }) => (
                <Container>
                    <Backlink href={permissionGroupListUrl()}>
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
                                    id: "mAabef",
                                    defaultMessage: "Group has full access to the store",
                                    description: "checkbox label",
                                })}
                                description={intl.formatMessage({
                                    id: "CYZse9",
                                    defaultMessage:
                                        "Expand or restrict group's permissions to access certain part of mzawadie system.",
                                    description: "card description",
                                })}
                            />
                        </div>
                    </Grid>

                    <div>
                        <Savebar
                            onCancel={() => navigate(permissionGroupListUrl())}
                            onSubmit={submit}
                            state={saveButtonBarState}
                            disabled={disabled}
                        />
                    </div>
                </Container>
            )}
        </Form>
    );
};

PermissionGroupDetailsPage.displayName = "PermissionGroupDetailsPage";

export default PermissionGroupDetailsPage;
