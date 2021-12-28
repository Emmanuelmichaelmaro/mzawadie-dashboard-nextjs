// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import AccountPermissionGroups from "@mzawadie/components/AccountPermissionGroups";
import AccountStatus from "@mzawadie/components/AppStatus";
import CardSpacer from "@mzawadie/components/CardSpacer";
import CardTitle from "@mzawadie/components/CardTitle";
import { ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import Container from "@mzawadie/components/Container";
import Form from "@mzawadie/components/Form";
import Grid from "@mzawadie/components/Grid";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import PageHeader from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames, getUserName, FetchMoreProps, SearchPageProps } from "@mzawadie/core";
import { StaffErrorFragment } from "@mzawadie/fragments/types/StaffErrorFragment";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useLocale from "@mzawadie/hooks/useLocale";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import createMultiAutocompleteSelectHandler from "@mzawadie/utils/handlers/multiAutocompleteSelectChangeHandler";
import { SearchPermissionGroups_search_edges_node } from "@mzawadie/views/searches/types/SearchPermissionGroups";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { StaffMemberDetails_user } from "../../types/StaffMemberDetails";
import StaffPassword from "../StaffPassword/StaffPassword";
import StaffPreferences from "../StaffPreferences";
import StaffProperties from "../StaffProperties/StaffProperties";

export interface StaffDetailsFormData {
    email: string;
    firstName: string;
    isActive: boolean;
    lastName: string;
    permissionGroups: string[];
}

export interface StaffDetailsPageProps extends SearchPageProps {
    availablePermissionGroups: SearchPermissionGroups_search_edges_node[];
    canEditAvatar: boolean;
    canEditPreferences: boolean;
    canEditStatus: boolean;
    canRemove: boolean;
    disabled: boolean;
    fetchMorePermissionGroups: FetchMoreProps;
    saveButtonBarState: ConfirmButtonTransitionState;
    staffMember: StaffMemberDetails_user;
    errors: StaffErrorFragment[];
    onBack: () => void;
    onChangePassword: () => void;
    onDelete: () => void;
    onImageDelete: () => void;
    onSubmit: (data: StaffDetailsFormData) => SubmitPromise;
    onImageUpload(file: File);
}

const StaffDetailsPage: React.FC<StaffDetailsPageProps> = ({
    availablePermissionGroups,
    canEditAvatar,
    canEditPreferences,
    canEditStatus,
    canRemove,
    disabled,
    errors,
    fetchMorePermissionGroups,
    initialSearch,
    onBack,
    onChangePassword,
    onDelete,
    onImageDelete,
    onImageUpload,
    onSearchChange,
    onSubmit,
    saveButtonBarState,
    staffMember,
}: StaffDetailsPageProps) => {
    const intl = useIntl();
    const { locale, setLocale } = useLocale();
    const [permissionGroupsDisplayValues, setPermissionGroupsDisplayValues] = useStateFromProps<
        MultiAutocompleteChoiceType[]
    >(
        (staffMember?.permissionGroups || []).map((group) => ({
            disabled: !group.userCanManage,
            label: group.name,
            value: group.id,
        })) || []
    );

    const initialForm: StaffDetailsFormData = {
        email: staffMember?.email || "",
        firstName: staffMember?.firstName || "",
        isActive: !!staffMember?.isActive,
        lastName: staffMember?.lastName || "",
        permissionGroups: staffMember?.permissionGroups?.map((pg) => pg.id) || [],
    };

    return (
        <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
            {({ data: formData, change, hasChanged, submit, toggleValue }) => {
                const permissionGroupsChange = createMultiAutocompleteSelectHandler(
                    toggleValue,
                    setPermissionGroupsDisplayValues,
                    permissionGroupsDisplayValues,
                    availablePermissionGroups?.map((group) => ({
                        label: group.name,
                        value: group.id,
                    })) || []
                );

                return (
                    <Container>
                        <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.staff)}</Backlink>
                        <PageHeader title={getUserName(staffMember)} />
                        <Grid>
                            <div>
                                <StaffProperties
                                    errors={errors}
                                    data={formData}
                                    disabled={disabled}
                                    canEditAvatar={canEditAvatar}
                                    staffMember={staffMember}
                                    onChange={change}
                                    onImageUpload={onImageUpload}
                                    onImageDelete={onImageDelete}
                                />
                                {canEditPreferences && (
                                    <>
                                        <CardSpacer />
                                        <StaffPassword onChangePassword={onChangePassword} />
                                    </>
                                )}
                            </div>
                            <div>
                                {canEditPreferences && (
                                    <StaffPreferences locale={locale} onLocaleChange={setLocale} />
                                )}
                                {canEditStatus && (
                                    <>
                                        <Card>
                                            <CardTitle
                                                title={intl.formatMessage({
                                                    defaultMessage: "Permissions",
                                                    id: "Fbr4Vp",
                                                    description: "dialog header",
                                                })}
                                            />
                                            <CardContent>
                                                <Typography>
                                                    {intl.formatMessage({
                                                        defaultMessage: "User is assigned to:",
                                                        id: "P+kVxW",
                                                        description: "card description",
                                                    })}
                                                </Typography>

                                                <AccountPermissionGroups
                                                    formData={formData}
                                                    disabled={disabled}
                                                    errors={errors}
                                                    initialSearch={initialSearch}
                                                    availablePermissionGroups={
                                                        availablePermissionGroups
                                                    }
                                                    onChange={permissionGroupsChange}
                                                    onSearchChange={onSearchChange}
                                                    displayValues={permissionGroupsDisplayValues}
                                                    {...fetchMorePermissionGroups}
                                                />
                                            </CardContent>
                                        </Card>
                                        <CardSpacer />
                                        <AccountStatus
                                            data={formData}
                                            disabled={disabled}
                                            label={intl.formatMessage({
                                                defaultMessage: "User is active",
                                                id: "XMrYaA",
                                                description: "checkbox label",
                                            })}
                                            onChange={change}
                                        />
                                    </>
                                )}
                            </div>
                        </Grid>
                        <Savebar
                            disabled={disabled || !hasChanged}
                            state={saveButtonBarState}
                            onCancel={onBack}
                            onSubmit={submit}
                            onDelete={canRemove ? onDelete : undefined}
                        />
                    </Container>
                );
            }}
        </Form>
    );
};

StaffDetailsPage.displayName = "StaffDetailsPage";

export default StaffDetailsPage;
