// @ts-nocheck
import AccountPermissions from "@mzawadie/components/AccountPermissions";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { ShopInfo_shop_permissions } from "@mzawadie/components/Shop/types/ShopInfo";
import { sectionNames } from "@mzawadie/core";
import { AppErrorFragment } from "@mzawadie/fragments/types/AppErrorFragment";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAppErrorMessage from "@mzawadie/utils/errors/app";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import CustomAppInformation from "../CustomAppInformation";

export interface CustomAppCreatePageFormData {
    hasFullAccess: boolean;
    name: string;
    permissions: PermissionEnum[];
}
export interface CustomAppCreatePageProps {
    disabled: boolean;
    errors: AppErrorFragment[];
    permissions: ShopInfo_shop_permissions[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: CustomAppCreatePageFormData) => void;
}

const CustomAppCreatePage: React.FC<CustomAppCreatePageProps> = (props) => {
    const { disabled, errors, permissions, saveButtonBarState, onBack, onSubmit } = props;
    const intl = useIntl();

    const initialForm: CustomAppCreatePageFormData = {
        hasFullAccess: false,
        name: "",
        permissions: [],
    };

    const formErrors = getFormErrors(["permissions"], errors || []);
    const permissionsError = getAppErrorMessage(formErrors.permissions, intl);

    return (
        <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
            {({ data, change, hasChanged, submit }) => (
                <Container>
                    <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.apps)}</Backlink>
                    <PageHeader
                        title={intl.formatMessage({
                            defaultMessage: "Create New App",
                            id: "GjH9uy",
                            description: "header",
                        })}
                    />
                    <Grid>
                        <div>
                            <CustomAppInformation
                                data={data}
                                disabled={disabled}
                                errors={errors}
                                onChange={change}
                            />
                        </div>
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

CustomAppCreatePage.displayName = "CustomAppCreatePage";

export default CustomAppCreatePage;
