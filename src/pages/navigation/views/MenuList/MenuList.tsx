// @ts-nocheck
import { DialogContentText } from "@material-ui/core";
import { ActionDialog } from "@mzawadie/components/ActionDialog";
import {
    buttonMessages,
    commonMessages,
    getStringOrPlaceholder,
    maybe,
    ListViews,
} from "@mzawadie/core";
import {
    useMenuBulkDeleteMutation,
    useMenuCreateMutation,
    useMenuDeleteMutation,
    useMenuListQuery,
} from "@mzawadie/graphql";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import { usePaginationReset } from "@mzawadie/hooks/usePaginationReset";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import { MenuCreateDialog } from "@mzawadie/pages/navigation/components/MenuCreateDialog";
import { MenuListPage } from "@mzawadie/pages/navigation/components/MenuListPage";
import { menuListUrl, MenuListUrlQueryParams, menuUrl } from "@mzawadie/pages/navigation/urls";
import { getById } from "@mzawadie/pages/orders/components/OrderReturnPage/utils";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getSortQueryVariables } from "./sort";

interface MenuListProps {
    params: MenuListUrlQueryParams;
}
const MenuList: React.FC<MenuListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const paginate = usePaginator();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const { updateListSettings, settings } = useListSettings(ListViews.NAVIGATION_LIST);

    usePaginationReset(menuListUrl, params, settings.rowNumber);

    const intl = useIntl();

    const closeModal = () =>
        navigate(
            menuListUrl({
                ...params,
                action: undefined,
                id: undefined,
                ids: undefined,
            }),
            { replace: true }
        );

    const paginationState = createPaginationState(settings.rowNumber, params);
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            sort: getSortQueryVariables(params),
        }),
        [params, settings.rowNumber]
    );
    const { data, loading, refetch } = useMenuListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        maybe(() => data.menus.pageInfo),
        paginationState,
        params
    );

    const [menuCreate, menuCreateOpts] = useMenuCreateMutation({
        onCompleted: (data) => {
            if (data.menuCreate.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Created menu",
                        id: "ugnggZ",
                    }),
                });
                navigate(menuUrl(data.menuCreate.menu.id));
            }
        },
    });

    const [menuDelete, menuDeleteOpts] = useMenuDeleteMutation({
        onCompleted: (data) => {
            if (data.menuDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage({
                        defaultMessage: "Deleted menu",
                        id: "OwG/0z",
                    }),
                });
                closeModal();
                refetch();
            }
        },
    });

    const [menuBulkDelete, menuBulkDeleteOpts] = useMenuBulkDeleteMutation({
        onCompleted: (data) => {
            if (data.menuBulkDelete.errors.length === 0) {
                notify({
                    status: "success",
                    text: intl.formatMessage(commonMessages.savedChanges),
                });
                closeModal();
                reset();
                refetch();
            }
        },
    });

    const handleSort = createSortHandler(navigate, menuListUrl, params);

    return (
        <>
            <MenuListPage
                disabled={loading}
                menus={mapEdgesToItems(data?.menus)}
                settings={settings}
                onAdd={() =>
                    navigate(
                        menuListUrl({
                            action: "add",
                        })
                    )
                }
                onBack={() => navigate(configurationMenuUrl)}
                onDelete={(id) =>
                    navigate(
                        menuListUrl({
                            action: "remove",
                            id,
                        })
                    )
                }
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onUpdateListSettings={updateListSettings}
                onRowClick={(id) => () => navigate(menuUrl(id))}
                onSort={handleSort}
                pageInfo={pageInfo}
                isChecked={isSelected}
                selected={listElements.length}
                sort={getSortParams(params)}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={
                    <Button
                        onClick={() =>
                            navigate(
                                menuListUrl({
                                    ...params,
                                    action: "remove-many",
                                    ids: listElements,
                                })
                            )
                        }
                    >
                        <FormattedMessage {...buttonMessages.remove} />
                    </Button>
                }
            />
            <MenuCreateDialog
                open={params.action === "add"}
                confirmButtonState={menuCreateOpts.status}
                disabled={menuCreateOpts.loading}
                errors={menuCreateOpts?.data?.menuCreate.errors || []}
                onClose={closeModal}
                onConfirm={(formData) =>
                    menuCreate({
                        variables: { input: formData },
                    })
                }
            />
            <ActionDialog
                open={params.action === "remove"}
                onClose={closeModal}
                confirmButtonState={menuDeleteOpts.status}
                onConfirm={() =>
                    menuDelete({
                        variables: {
                            id: params.id,
                        },
                    })
                }
                variant="delete"
                title={intl.formatMessage({
                    defaultMessage: "Delete Menu",
                    description: "dialog header",
                    id: "QzseV7",
                })}
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="Are you sure you want to delete {menuName}?"
                        id="bj1U23"
                        values={{
                            menuName: getStringOrPlaceholder(
                                mapEdgesToItems(data?.menus)?.find(getById(params.id))?.name
                            ),
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
            <ActionDialog
                open={params.action === "remove-many" && maybe(() => params.ids.length > 0)}
                onClose={closeModal}
                confirmButtonState={menuBulkDeleteOpts.status}
                onConfirm={() =>
                    menuBulkDelete({
                        variables: {
                            ids: params.ids,
                        },
                    })
                }
                variant="delete"
                title={intl.formatMessage({
                    defaultMessage: "Delete Menus",
                    description: "dialog header",
                    id: "1LBYpE",
                })}
            >
                <DialogContentText>
                    <FormattedMessage
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this menu?} other{Are you sure you want to delete {displayQuantity} menus?}}"
                        id="svK+kv"
                        values={{
                            counter: maybe(() => params.ids.length.toString(), "..."),
                            displayQuantity: (
                                <strong>{maybe(() => params.ids.length.toString(), "...")}</strong>
                            ),
                        }}
                    />
                </DialogContentText>
            </ActionDialog>
        </>
    );
};
export default MenuList;
