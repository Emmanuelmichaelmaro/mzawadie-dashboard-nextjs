// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { CollectionCreateUrlQueryParams } from "@mzawadie/views/collections/urls";
import CollectionCreateView from "@mzawadie/views/collections/views/CollectionCreate";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const CollectionCreate: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const params: CollectionCreateUrlQueryParams =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.collections)} />
            <CollectionCreateView params={params} />
        </>
    );
};

CollectionCreate.layout = AppLayout;
CollectionCreate.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default CollectionCreate;
