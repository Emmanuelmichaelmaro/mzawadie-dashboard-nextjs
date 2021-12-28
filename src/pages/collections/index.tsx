// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { asSortParams } from "@mzawadie/utils/sort";
import {
    CollectionListUrlQueryParams,
    CollectionListUrlSortField,
} from "@mzawadie/views/collections/urls";
import CollectionListView from "@mzawadie/views/collections/views/CollectionList";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const CollectionList: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    // @ts-ignore
    const params: CollectionListUrlQueryParams = asSortParams(qs, CollectionListUrlSortField);

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.collections)} />
            <CollectionListView params={params} />
        </>
    );
};

CollectionList.layout = AppLayout;
CollectionList.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default CollectionList;
