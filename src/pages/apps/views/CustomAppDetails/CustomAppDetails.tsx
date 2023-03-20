// @ts-nocheck
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { API_URI, commonMessages, extractMutationErrors, getStringOrPlaceholder } from "@mzawadie/core";
import {
    AppTokenCreateMutation,
    AppTokenDeleteMutation,
    AppUpdateMutation,
    useAppQuery,
    useWebhookDeleteMutation,
    WebhookDeleteMutation,
    useAppActivateMutation,
    useAppDeactivateMutation,
    useAppTokenCreateMutation,
    useAppTokenDeleteMutation,
    useAppUpdateMutation,
} from "@mzawadie/graphql";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import useShop from "@mzawadie/hooks/useShop";
import { AppActivateDialog } from "@mzawadie/pages/apps/components/AppActivateDialog";
import { AppDeactivateDialog } from "@mzawadie/pages/apps/components/AppDeactivateDialog";
import { TokenCreateDialog } from "@mzawadie/pages/apps/components/TokenCreateDialog";
import { TokenDeleteDialog } from "@mzawadie/pages/apps/components/TokenDeleteDialog";
import { appMessages } from "@mzawadie/pages/apps/messages";
import {
    appsListUrl,
    customAppUrl,
    CustomAppUrlDialog,
    CustomAppUrlQueryParams,
} from "@mzawadie/pages/apps/urls";
import { WebhookDeleteDialog } from "@mzawadie/pages/webhooks/components/WebhookDeleteDialog";
import { webhookAddPath, webhookPath } from "@mzawadie/pages/webhooks/urls";
import getAppErrorMessage from "@mzawadie/utils/errors/app";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import {
    CustomAppDetailsPage,
    CustomAppDetailsPageFormData,
} from "../../components/CustomAppDetailsPage";

interface OrderListProps {
    id: string;
    params: CustomAppUrlQueryParams;
    token: string;
    onTokenClose: () => void;
}

export const CustomAppDetails: React.FC<OrderListProps> = ({ id, params, token, onTokenClose }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const intl = useIntl();
    const shop = useShop();

    React.useEffect(() => onTokenClose, []);

    const [openModal, closeModal] = createDialogActionHandlers<
        CustomAppUrlDialog,
        CustomAppUrlQueryParams
    >(navigate, (params) => customAppUrl(id, params), params);

    const { data, loading, refetch } = useAppQuery({
        displayLoader: true,
        variables: { id },
    });

    const [activateApp, activateAppResult] = useAppActivateMutation({
        onCompleted: (data) => {
            const errors = data?.appActivate?.errors;

            if (errors?.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(appMessages.appActivated),
                });
                refetch();
                closeModal();
            } else {
                errors.forEach((error) =>
                    notify({
                        status: "error",
                        text: getAppErrorMessage(error, intl),
                    })
                );
            }
        },
    });

    const [deactivateApp, deactivateAppResult] = useAppDeactivateMutation({
        onCompleted: (data) => {
            const errors = data?.appDeactivate?.errors;

            if (errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(appMessages.appDeactivated),
                });
                refetch();
                closeModal();
            } else {
                errors.forEach((error) =>
                    notify({
                        status: "error",
                        text: getAppErrorMessage(error, intl),
                    })
                );
            }
        },
    });

    const onWebhookDelete = (data: WebhookDeleteMutation) => {
        if (data.webhookDelete?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            navigate(customAppUrl(id));
            closeModal();
            refetch();
        }
    };

    const [webhookDelete, webhookDeleteOpts] = useWebhookDeleteMutation({
        onCompleted: onWebhookDelete,
    });

    const handleRemoveWebhookConfirm = () => {
        webhookDelete({
            variables: {
                id: params.id,
            },
        });
    };

    const onAppUpdate = (data: AppUpdateMutation) => {
        if (data?.appUpdate?.errors?.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
        }
    };

    const handleBack = () => navigate(appsListUrl());

    const customApp = data?.app;

    if (customApp === null) {
        return <NotFoundPage onBack={handleBack} />;
    }

    const onTokenCreate = (data: AppTokenCreateMutation) => {
        if (data?.appTokenCreate?.errors.length === 0) {
            refetch();
        }
    };

    const onTokenDelete = (data: AppTokenDeleteMutation) => {
        if (data?.appTokenDelete?.errors.length === 0) {
            notify({
                status: "success",
                text: intl.formatMessage(commonMessages.savedChanges),
            });
            refetch();
            closeModal();
        }
    };

    const [updateApp, updateAppOpts] = useAppUpdateMutation({
        onCompleted: onAppUpdate,
    });

    const [createToken, createTokenOpts] = useAppTokenCreateMutation({
        onCompleted: onTokenCreate,
    });

    const [deleteToken, deleteTokenOpts] = useAppTokenDeleteMutation({
        onCompleted: onTokenDelete,
    });

    const handleSubmit = async (data: CustomAppDetailsPageFormData) =>
        extractMutationErrors(
            updateApp({
                variables: {
                    id,
                    input: {
                        name: data.name,
                        permissions: data.hasFullAccess
                            ? shop.permissions.map((permission) => permission.code)
                            : data.permissions,
                    },
                },
            })
        );

    const handleTokenCreate = (name: string) =>
        createToken({
            variables: {
                input: {
                    app: id,
                    name,
                },
            },
        });

    const handleTokenDelete = () =>
        deleteToken({
            variables: {
                id: params.id,
            },
        });

    const handleActivateConfirm = () => {
        activateApp({ variables: { id } });
    };

    const handleDeactivateConfirm = () => {
        deactivateApp({ variables: { id } });
    };

    const currentToken = data?.app?.tokens?.find((token) => token.id === params.id);

    return (
        <>
            <WindowTitle title={getStringOrPlaceholder(customApp?.name)} />

            <CustomAppDetailsPage
                apiUri={API_URI}
                disabled={loading}
                errors={updateAppOpts.data?.appUpdate?.errors || []}
                token={token}
                navigateToWebhookDetails={(id) => () => navigate(webhookPath(id))}
                onApiUriClick={() => open(API_URI, "blank")}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onTokenClose={onTokenClose}
                onTokenCreate={() => openModal("create-token")}
                onTokenDelete={(id) =>
                    openModal("remove-token", {
                        id,
                    })
                }
                onWebhookCreate={() => navigate(webhookAddPath(id))}
                onWebhookRemove={(id) =>
                    openModal("remove-webhook", {
                        id,
                    })
                }
                onAppActivateOpen={() => openModal("app-activate")}
                onAppDeactivateOpen={() => openModal("app-deactivate")}
                permissions={shop?.permissions}
                app={data?.app}
                saveButtonBarState={updateAppOpts.status}
            />

            <TokenCreateDialog
                confirmButtonState={createTokenOpts.status}
                onClose={closeModal}
                onCreate={handleTokenCreate}
                open={params.action === "create-token"}
                token={createTokenOpts.data?.appTokenCreate.authToken}
            />

            <TokenDeleteDialog
                confirmButtonState={deleteTokenOpts.status}
                name={
                    currentToken?.name || currentToken?.authToken
                        ? `**** ${currentToken.authToken}`
                        : "..."
                }
                onClose={closeModal}
                onConfirm={handleTokenDelete}
                open={params.action === "remove-token"}
            />

            <WebhookDeleteDialog
                confirmButtonState={webhookDeleteOpts.status}
                name={data?.app?.webhooks.find((webhook) => webhook.id === params.id)?.name}
                onClose={closeModal}
                onConfirm={handleRemoveWebhookConfirm}
                open={params.action === "remove-webhook"}
            />

            <AppActivateDialog
                confirmButtonState={activateAppResult.status}
                name={data?.app?.name}
                onClose={closeModal}
                onConfirm={handleActivateConfirm}
                open={params.action === "app-activate"}
            />

            <AppDeactivateDialog
                confirmButtonState={deactivateAppResult.status}
                name={data?.app?.name}
                onClose={closeModal}
                onConfirm={handleDeactivateConfirm}
                thirdParty={false}
                open={params.action === "app-deactivate"}
            />
        </>
    );
};

export default CustomAppDetails;
