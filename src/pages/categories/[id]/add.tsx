// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import CategoryCreateView from "@mzawadie/views/categories/views/CategoryCreate";
import { useRouter } from "next/router";
import React from "react";
import { useIntl } from "react-intl";

const CategoryCreate: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.categories)} />
            <CategoryCreateView parentId={router.query.id ? router.query.id : undefined} />
        </>
    );
};

// @ts-ignore
CategoryCreate.layout = AppLayout;
CategoryCreate.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default CategoryCreate;
