// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import PermissionGroupCreate from "@mzawadie/views/permissionGroups/views/PermissionGroupCreate";
import React from "react";

PermissionGroupCreate.layout = AppLayout;
PermissionGroupCreate.permissions = [PermissionEnum.MANAGE_STAFF];

export default PermissionGroupCreate;
