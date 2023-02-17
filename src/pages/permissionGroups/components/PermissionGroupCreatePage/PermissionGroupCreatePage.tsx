// @ts-nocheck
import { AccountPermissions } from "@mzawadie/components/AccountPermissions";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { PermissionGroupErrorFragment } from "@mzawadie/fragments/types/PermissionGroupErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import getPermissionGroupErrorMessage from "@mzawadie/utils/errors/permissionGroups";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { PermissionData } from "../PermissionGroupDetailsPage";
import { PermissionGroupInfo } from "../PermissionGroupInfo";

export interface PermissionGroupCreateFormData {
    name: string;
    hasFullAccess: boolean;
    isActive: boolean;
    permissions: PermissionEnum[];
}

const initialForm: PermissionGroupCreateFormData = {
    hasFullAccess: false,
    isActive: false,
    name: "",
    permissions: [],
};

export interface PermissionGroupCreatePageProps {
    disabled: boolean;
    errors: PermissionGroupErrorFragment[];
    permissions: PermissionData[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: PermissionGroupCreateFormData) => SubmitPromise;
}

const PermissionGroupCreatePage: React.FC<PermissionGroupCreatePageProps> = ({
    disabled,
    permissions,
    onBack,
    onSubmit,
    saveButtonBarState,
    errors,
}) => {
    const intl = useIntl();

    const formErrors = getFormErrors(["addPermissions"], errors || []);
    const permissionsError = getPermissionGroupErrorMessage(formErrors.addPermissions, intl);

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
            {({ data, change, submit, hasChanged }) => (
                <Container>
                    <Backlink onClick={onBack}>
                        {intl.formatMessage(sectionNames.permissionGroups)}
                    </Backlink>
                    <Grid>
                        <div>
                            <PermissionGroupInfo
                                data={data}
                                errors={errors}
                                onChange={change}
                                disabled={disabled}
                            />
                        </div>
                        <div>
                            <AccountPermissions
                                permissionsExceeded={false}
                                data={data}
                                errorMessage={permissionsError}
                                disabled={disabled}
                                permissions={permissions}
                                onChange={change}
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
                            disabled={disabled || !hasChanged}
                        />
                    </div>
                </Container>
            )}
        </Form>
    );
};
PermissionGroupCreatePage.displayName = "PermissionGroupCreatePage";
export default PermissionGroupCreatePage;
