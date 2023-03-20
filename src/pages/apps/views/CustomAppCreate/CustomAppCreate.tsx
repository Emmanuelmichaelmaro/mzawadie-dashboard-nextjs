// @ts-nocheck
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { commonMessages, extractMutationErrors } from "@mzawadie/core";
import { AppCreateMutation, useAppCreateMutation } from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import React from "react";
import { useIntl } from "react-intl";

import { CustomAppCreatePage, CustomAppCreatePageFormData } from "../../components/CustomAppCreatePage";
import { appsListUrl, customAppUrl } from "../../urls";
import { messages } from "./messages";

interface CustomAppCreateProps {
    setToken: (token: string) => void;
}
export const CustomAppCreate: React.FC<CustomAppCreateProps> = ({ setToken }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const shop = useShop();

    const onSubmit = (data: AppCreateMutation) => {
        if (data.appCreate?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            navigate(customAppUrl(data.appCreate.app?.id));
            setToken(data.appCreate.authToken);
        }
    };

    const handleBack = () => navigate(appsListUrl());

    const [createApp, createAppOpts] = useAppCreateMutation({
        onCompleted: onSubmit,
    });

    const handleSubmit = async (data: CustomAppCreatePageFormData) =>
        extractMutationErrors(
            createApp({
                variables: {
                    input: {
                        name: data.name,
                        permissions: data.hasFullAccess
                            ? shop?.permissions.map((permission) => permission?.code)
                            : data.permissions,
                    },
                },
            })
        );

    return (
        <>
            <WindowTitle title={intl.formatMessage(messages.createApp)} />
            <CustomAppCreatePage
                disabled={false}
                errors={createAppOpts.data?.appCreate?.errors || []}
                onBack={handleBack}
                onSubmit={handleSubmit}
                permissions={shop?.permissions}
                saveButtonBarState={createAppOpts.status}
            />
        </>
    );
};

export default CustomAppCreate;
