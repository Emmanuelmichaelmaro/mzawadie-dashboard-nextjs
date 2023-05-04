// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { extractMutationErrors } from "@mzawadie/core";
import { usePermissionGroupCreateMutation } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { useUser } from "@mzawadie/pages/auth";
import { PermissionData } from "@mzawadie/pages/permissionGroups/components/PermissionGroupDetailsPage";
import React from "react";
import { useIntl } from "react-intl";

import {
    PermissionGroupCreatePage,
    PermissionGroupCreateFormData,
} from "../../components/PermissionGroupCreatePage";
import { permissionGroupDetailsUrl } from "../../urls";

const PermissionGroupCreateView: React.FC = () => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const shop = useShop();
    const user = useUser();

    const [createPermissionGroup, createPermissionGroupResult] = usePermissionGroupCreateMutation({
        onCompleted: (data) => {
            if (data?.permissionGroupCreate?.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        id: "eUjFjW",
                        defaultMessage: "Permission group created",
                    }),
                });
                navigate(permissionGroupDetailsUrl(data.permissionGroupCreate?.group?.id));
            }
        },
    });

    const errors = createPermissionGroupResult?.data?.permissionGroupCreate?.errors || [];

    const onSubmit = (formData: PermissionGroupCreateFormData) =>
        extractMutationErrors(
            createPermissionGroup({
                variables: {
                    input: {
                        addPermissions: formData.hasFullAccess
                            ? shop.permissions.map((perm) => perm.code)
                            : formData.permissions,
                        addUsers: [],
                        name: formData.name,
                    },
                },
            })
        );

    const userPermissions = user?.user?.userPermissions?.map((p) => p.code) || [];

    const permissions: PermissionData[] =
        shop?.permissions.map(
            (p) =>
                ({
                    ...p,
                    disabled: !userPermissions.includes(p.code),
                    lastSource: false,
                } as PermissionData)
        ) || [];

    return (
        <>
            <WindowTitle
                title={intl.formatMessage({
                    id: "Irflxf",
                    defaultMessage: "Create category",
                    description: "window title",
                })}
            />

            <PermissionGroupCreatePage
                errors={errors}
                disabled={createPermissionGroupResult.loading}
                permissions={permissions}
                saveButtonBarState={createPermissionGroupResult.status}
                onSubmit={onSubmit}
            />
        </>
    );
};

PermissionGroupCreateView.displayName = "PermissionGroupCreateView";

export default PermissionGroupCreateView;
