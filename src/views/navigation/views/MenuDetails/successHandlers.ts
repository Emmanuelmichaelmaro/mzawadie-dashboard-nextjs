// @ts-nocheck
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";
import { UseNotifierResult } from "@mzawadie/hooks/useNotifier";
import { commonMessages } from "@mzawadie/intl";
import { IntlShape } from "react-intl";

import { MenuDelete } from "../../types/MenuDelete";
import { MenuItemCreate } from "../../types/MenuItemCreate";
import { MenuItemUpdate } from "../../types/MenuItemUpdate";
import { MenuUpdate } from "../../types/MenuUpdate";
import { menuListUrl, menuUrl } from "../../urls";

export function handleItemCreate(
    data: MenuItemCreate,
    notify: UseNotifierResult,
    closeModal: () => void,
    intl: IntlShape
) {
    if (data.menuItemCreate.errors.length === 0) {
        closeModal();
        notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
        });
    }
}

export function handleItemUpdate(
    data: MenuItemUpdate,
    id: string,
    navigate: UseNavigatorResult,
    notify: UseNotifierResult,
    intl: IntlShape
) {
    if (data.menuItemUpdate.errors.length === 0) {
        notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(
            menuUrl(id, {
                action: undefined,
                id: undefined,
            })
        );
    }
}

export function handleDelete(
    data: MenuDelete,
    navigate: UseNavigatorResult,
    notify: UseNotifierResult,
    intl: IntlShape
) {
    if (data.menuDelete.errors.length === 0) {
        notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(menuListUrl(), true);
    }
}

export function handleUpdate(
    data: MenuUpdate,
    notify: UseNotifierResult,
    refetch: () => void,
    intl: IntlShape
) {
    if (
        data.menuItemBulkDelete.errors.length === 0 &&
        data.menuItemMove.errors.length === 0 &&
        data.menuUpdate.errors.length === 0
    ) {
        notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
        });
        refetch();
    }
}
