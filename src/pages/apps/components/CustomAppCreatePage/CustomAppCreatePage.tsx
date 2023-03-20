// @ts-nocheck
import { AccountPermissions } from "@mzawadie/components/AccountPermissions";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { AppErrorFragment, PermissionEnum, PermissionFragment } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { getFormErrors } from "@mzawadie/utils/errors";
import getAppErrorMessage from "@mzawadie/utils/errors/app";
import { ConfirmButtonTransitionState, Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { CustomAppInformation } from "../CustomAppInformation";

export interface CustomAppCreatePageFormData {
    hasFullAccess: boolean;
    name: string;
    permissions: PermissionEnum[];
}
export interface CustomAppCreatePageProps {
    disabled: boolean;
    errors: AppErrorFragment[];
    permissions: PermissionFragment[];
    saveButtonBarState: ConfirmButtonTransitionState;
    onBack: () => void;
    onSubmit: (data: CustomAppCreatePageFormData) => SubmitPromise<AppErrorFragment[]>;
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
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
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
