import { Typography } from "@material-ui/core";
import { FetchMoreProps, SearchPageProps } from "@mzawadie/core";
import { StaffErrorFragment } from "@mzawadie/fragments/types/StaffErrorFragment";
import { FormChange } from "@mzawadie/hooks/useForm";
import { getFormErrors } from "@mzawadie/utils/errors";
import getStaffErrorMessage from "@mzawadie/utils/errors/staff";
import { SearchPermissionGroups_search_edges_node } from "@mzawadie/views/searches/types/SearchPermissionGroups";
import React from "react";
import { useIntl } from "react-intl";

import MultiAutocompleteSelectField, {
    MultiAutocompleteChoiceType,
} from "../MultiAutocompleteSelectField";

export interface AccountPermissionGroupsProps extends FetchMoreProps, SearchPageProps {
    formData: {
        permissionGroups: string[];
    };
    disabled: boolean;
    errors: StaffErrorFragment[];
    availablePermissionGroups: SearchPermissionGroups_search_edges_node[];
    onChange: FormChange;
    displayValues: MultiAutocompleteChoiceType[];
}

const AccountPermissionGroups: React.FC<AccountPermissionGroupsProps> = (props) => {
    const {
        availablePermissionGroups,
        disabled,
        displayValues,
        errors,
        formData,
        hasMore,
        loading,
        onChange,
        onFetchMore,
        onSearchChange,
    } = props;

    const intl = useIntl();

    const choices = availablePermissionGroups?.map((pg) => ({
        disabled: !pg.userCanManage,
        label: pg.name,
        value: pg.id,
    }));
    const formErrors = getFormErrors(["addGroups", "removeGroups"], errors);
    return (
        <>
            <MultiAutocompleteSelectField
                displayValues={displayValues}
                label={intl.formatMessage({
                    defaultMessage: "Permission groups",
                    id: "C7eDb9",
                })}
                choices={disabled ? [] : choices}
                name="permissionGroups"
                value={formData?.permissionGroups}
                onChange={onChange}
                fetchChoices={onSearchChange}
                data-test="permissionGroups"
                onFetchMore={onFetchMore}
                hasMore={hasMore}
                loading={loading}
            />
            {!!formErrors.addGroups && (
                <Typography color="error">
                    {getStaffErrorMessage(formErrors.addGroups, intl)}
                </Typography>
            )}
            {!!formErrors.removeGroups && (
                <Typography color="error">
                    {getStaffErrorMessage(formErrors.removeGroups, intl)}
                </Typography>
            )}
        </>
    );
};

AccountPermissionGroups.displayName = "AccountPermissionGroups";

export default AccountPermissionGroups;
