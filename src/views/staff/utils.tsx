// @ts-nocheck
import difference from "lodash/difference";

import { StaffDetailsFormData } from "./components/StaffDetailsPage";
import { StaffMemberDetails_user } from "./types/StaffMemberDetails";

/**
 * Return lists of groups which have to be added and removed from user.
 */
// eslint-disable-next-line import/prefer-default-export
export const groupsDiff = (user: StaffMemberDetails_user, formData: StaffDetailsFormData) => {
    const newGroups = formData.permissionGroups;
    const oldGroups = user?.permissionGroups?.map((u) => u.id);

    return {
        addGroups: difference(newGroups, oldGroups),
        removeGroups: difference(oldGroups, newGroups),
    };
};
