// @ts-nocheck
import { commonMessages } from "@mzawadie/core";
import {
    MenuDeleteMutation,
    MenuItemCreateMutation,
    MenuItemUpdateMutation,
    MenuUpdateMutation,
} from "@mzawadie/graphql";
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";
import { UseNotifierResult } from "@mzawadie/hooks/useNotifier";
import { menuListUrl, menuUrl } from "@mzawadie/pages/navigation/urls";
import { IntlShape } from "react-intl";

export function handleItemCreate(
    data: MenuItemCreateMutation,
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
    data: MenuItemUpdateMutation,
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
    data: MenuDeleteMutation,
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
    data: MenuUpdateMutation,
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
