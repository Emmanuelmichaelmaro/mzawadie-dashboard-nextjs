// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { CollectionUrlQueryParams } from "@mzawadie/views/collections/urls";
import CollectionDetailsView from "@mzawadie/views/collections/views/CollectionDetails";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";

const CollectionDetails: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const params: CollectionUrlQueryParams =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.collections)} />
            <CollectionDetailsView id={router.query.id} params={params} />
        </>
    );
};

CollectionDetails.layout = AppLayout;
CollectionDetails.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default CollectionDetails;
