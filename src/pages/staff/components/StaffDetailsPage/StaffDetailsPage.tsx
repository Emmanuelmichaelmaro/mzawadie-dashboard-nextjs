// @ts-nocheck
import { Card, CardContent, Typography } from "@material-ui/core";
import { AccountPermissionGroups } from "@mzawadie/components/AccountPermissionGroups";
import { Backlink } from "@mzawadie/components/Backlink";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Container from "@mzawadie/components/Container";
import { Form } from "@mzawadie/components/Form";
import { Grid } from "@mzawadie/components/Grid";
import { MultiAutocompleteChoiceType } from "@mzawadie/components/MultiAutocompleteSelectField";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Savebar from "@mzawadie/components/Savebar";
import { sectionNames } from "@mzawadie/core";
import { getUserName } from "@mzawadie/core";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@mzawadie/core";
import {
    SearchPermissionGroupsQuery,
    StaffErrorFragment,
    StaffMemberDetailsFragment,
} from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import useLocale from "@mzawadie/hooks/useLocale";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useStateFromProps from "@mzawadie/hooks/useStateFromProps";
import { staffListUrl } from "@mzawadie/pages/staff/urls";
import createMultiAutocompleteSelectHandler from "@mzawadie/utils/handlers/multiAutocompleteSelectChangeHandler";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import StaffPassword from "../StaffPassword/StaffPassword";
import StaffPreferences from "../StaffPreferences/StaffPreferences";
import StaffProperties from "../StaffProperties/StaffProperties";
import UserStatus from "../UserStatus/UserStatus";
import { staffDetailsPageMessages as messages } from "./messages";
import useStyles from "./styles";

export interface StaffDetailsFormData {
    email: string;
    firstName: string;
    isActive: boolean;
    lastName: string;
    permissionGroups: string[];
}

export interface StaffDetailsPageProps extends SearchPageProps {
    availablePermissionGroups: RelayToFlat<SearchPermissionGroupsQuery["search"]>;
    canEditAvatar: boolean;
    canEditPreferences: boolean;
    canEditStatus: boolean;
    canRemove: boolean;
    disabled: boolean;
    fetchMorePermissionGroups: FetchMoreProps;
    saveButtonBarState: ConfirmButtonTransitionState;
    staffMember: StaffMemberDetailsFragment;
    errors: StaffErrorFragment[];
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
    const classes = useStyles();
    const navigate = useNavigator();

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
        permissionGroups: staffMember?.permissionGroups.map((pg) => pg.id) || [],
    };

    return (
        <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
            {({ data: formData, change, isSaveDisabled, submit, toggleValue }) => {
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
                        <Backlink href={staffListUrl()}>
                            {intl.formatMessage(sectionNames.staff)}
                        </Backlink>

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

                            <div className={classes.noOverflow}>
                                {canEditPreferences && (
                                    <StaffPreferences locale={locale} onLocaleChange={setLocale} />
                                )}

                                {canEditStatus && (
                                    <>
                                        <UserStatus
                                            data={formData}
                                            disabled={disabled}
                                            label={intl.formatMessage(messages.userStatusActive)}
                                            onChange={change}
                                        />

                                        <CardSpacer />

                                        <Card>
                                            <CardTitle
                                                title={intl.formatMessage({
                                                    id: "Fbr4Vp",
                                                    defaultMessage: "Permissions",
                                                    description: "dialog header",
                                                })}
                                            />

                                            <CardContent>
                                                <Typography>
                                                    {intl.formatMessage({
                                                        id: "P+kVxW",
                                                        defaultMessage: "User is assigned to:",
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
                                    </>
                                )}
                            </div>
                        </Grid>

                        <Savebar
                            disabled={isSaveDisabled}
                            state={saveButtonBarState}
                            onCancel={() => navigate(staffListUrl())}
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
