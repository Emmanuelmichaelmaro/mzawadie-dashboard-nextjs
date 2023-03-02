// @ts-nocheck
import activateIcon from "@assets/images/activate-icon.svg";
import { AccountPermissions } from "@mzawadie/components/AccountPermissions";
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ShopInfo_shop_permissions } from "@mzawadie/components/Shop/types/ShopInfo";
import { sectionNames } from "@mzawadie/core";
import { AppErrorFragment } from "@mzawadie/fragments/types/AppErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { WebhooksList } from "@mzawadie/pages/webhooks/components/WebhooksList";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAppErrorMessage from "@mzawadie/utils/errors/app";
import { ConfirmButtonTransitionState, Backlink, Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import { AppUpdate_appUpdate_app } from "../../types/AppUpdate";
import { CustomAppDefaultToken } from "../CustomAppDefaultToken";
import { CustomAppInformation } from "../CustomAppInformation";
import { CustomAppTokens } from "../CustomAppTokens";

export interface CustomAppDetailsPageFormData {
    hasFullAccess: boolean;
    isActive: boolean;
    name: string;
    permissions: PermissionEnum[];
}
export interface CustomAppDetailsPageProps {
    apiUri: string;
    disabled: boolean;
    errors: AppErrorFragment[];
    permissions: ShopInfo_shop_permissions[];
    saveButtonBarState: ConfirmButtonTransitionState;
    app: AppUpdate_appUpdate_app;
    token: string;
    onApiUriClick: () => void;
    onBack: () => void;
    onTokenDelete: (id: string) => void;
    onTokenClose: () => void;
    onTokenCreate: () => void;
    onSubmit: (data: CustomAppDetailsPageFormData) => SubmitPromise<AppErrorFragment[]>;
    onWebhookCreate: () => void;
    onWebhookRemove: (id: string) => void;
    navigateToWebhookDetails: (id: string) => () => void;
    onAppActivateOpen: () => void;
    onAppDeactivateOpen: () => void;
}

const CustomAppDetailsPage: React.FC<CustomAppDetailsPageProps> = (props) => {
    const {
        apiUri,
        disabled,
        errors,
        permissions,
        saveButtonBarState,
        app,
        navigateToWebhookDetails,
        token,
        onApiUriClick,
        onBack,
        onTokenClose,
        onTokenCreate,
        onTokenDelete,
        onSubmit,
        onWebhookCreate,
        onWebhookRemove,
        onAppActivateOpen,
        onAppDeactivateOpen,
    } = props;
    const intl = useIntl();
    const classes = useStyles({});

    const webhooks = app?.webhooks;

    const formErrors = getFormErrors(["permissions"], errors || []);
    const permissionsError = getAppErrorMessage(formErrors.permissions, intl);

    const initialForm: CustomAppDetailsPageFormData = {
        hasFullAccess:
            permissions?.filter(
                (perm) =>
                    app?.permissions?.filter((userPerm) => userPerm.code === perm.code).length === 0
            ).length === 0 || false,
        isActive: !!app?.isActive,
        name: app?.name || "",
        permissions: app?.permissions?.map((perm) => perm.code) || [],
    };

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
            {({ data, change, hasChanged, submit }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.apps)}</Backlink>

                    <PageHeader title={app?.name}>
                        <Button
                            variant="secondary"
                            className={classes.activateButton}
                            disableFocusRipple
                            onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
                        >
                            <img src={activateIcon} alt="" />

                            {data?.isActive ? (
                                <FormattedMessage
                                    defaultMessage="Deactivate"
                                    id="whTEcF"
                                    description="link"
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="Activate"
                                    id="P5twxk"
                                    description="link"
                                />
                            )}
                        </Button>
                    </PageHeader>

                    <Grid>
                        <div>
                            {token && (
                                <>
                                    <CustomAppDefaultToken
                                        apiUri={apiUri}
                                        token={token}
                                        onApiUriClick={onApiUriClick}
                                        onTokenClose={onTokenClose}
                                    />
                                    <CardSpacer />
                                </>
                            )}

                            <CustomAppInformation
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                onChange={change}
                            />

                            <CardSpacer />

                            <CustomAppTokens
                                tokens={app?.tokens}
                                onCreate={onTokenCreate}
                                onDelete={onTokenDelete}
                            />

                            <CardSpacer />

                            <WebhooksList
                                webhooks={webhooks}
                                onRemove={onWebhookRemove}
                                onRowClick={navigateToWebhookDetails}
                                onCreate={app?.isActive && onWebhookCreate}
                            />
                        </div>

                        <div>
                            <AccountPermissions
                                data={data}
                                errorMessage={permissionsError}
                                disabled={disabled}
                                permissions={permissions}
                                permissionsExceeded={false}
                                onChange={change}
                                fullAccessLabel={intl.formatMessage({
                                    defaultMessage: "Grant this app full access to the store",
                                    id: "D4nzdD",
                                    description: "checkbox label",
                                })}
                                description={intl.formatMessage({
                                    defaultMessage:
                                        "Expand or restrict app permissions to access certain part of Saleor system.",
                                    id: "flP8Hj",
                                    description: "card description",
                                })}
                            />
                        </div>
                    </Grid>

                    <Savebar
                        disabled={disabled || !hasChanged}
                        state={saveButtonBarState}
                        onCancel={onBack}
                        onSubmit={submit}
                    />
                </Container>
            )}
        </Form>
    );
};

CustomAppDetailsPage.displayName = "CustomAppDetailsPage";

export default CustomAppDetailsPage;
