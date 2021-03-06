// @ts-nocheck
import { Button, DialogContentText, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@mzawadie/components/ActionDialog";
import { maybe, ListViews } from "@mzawadie/core";
import useBulkActions from "@mzawadie/hooks/useBulkActions";
import useListSettings from "@mzawadie/hooks/useListSettings";
import useNavigator from "@mzawadie/hooks/useNavigator";
import useNotifier from "@mzawadie/hooks/useNotifier";
import usePaginator, { createPaginationState } from "@mzawadie/hooks/usePaginator";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import createSortHandler from "@mzawadie/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@mzawadie/utils/maps";
import { getSortParams } from "@mzawadie/utils/sort";
import { configurationMenuUrl } from "@mzawadie/views/configuration";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageListPage from "../../components/PageListPage/PageListPage";
import { TypedPageBulkPublish, TypedPageBulkRemove } from "../../mutations";
import { usePageListQuery } from "../../queries";
import { PageBulkPublish } from "../../types/PageBulkPublish";
import { PageBulkRemove } from "../../types/PageBulkRemove";
import {
    pageCreateUrl,
    pageListUrl,
    PageListUrlDialog,
    PageListUrlQueryParams,
    pageUrl,
} from "../../urls";
import { getSortQueryVariables } from "./sort";

interface PageListProps {
    params: PageListUrlQueryParams;
}

export const PageList: React.FC<PageListProps> = ({ params }) => {
    const navigate = useNavigator();
    const notify = useNotifier();
    const paginate = usePaginator();
    const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
    const { updateListSettings, settings } = useListSettings(ListViews.PAGES_LIST);
    const intl = useIntl();

    const paginationState = createPaginationState(settings.rowNumber, params);
    const queryVariables = React.useMemo(
        () => ({
            ...paginationState,
            sort: getSortQueryVariables(params),
        }),
        [params]
    );
    const { data, loading, refetch } = usePageListQuery({
        displayLoader: true,
        variables: queryVariables,
    });

    const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
        maybe(() => data.pages.pageInfo),
        paginationState,
        params
    );

    const [openModal, closeModal] = createDialogActionHandlers<
        PageListUrlDialog,
        PageListUrlQueryParams
    >(navigate, pageListUrl, params);

    const handlePageBulkPublish = (data: PageBulkPublish) => {
        if (data.pageBulkPublish.errors.length === 0) {
            closeModal();
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Published pages",
                    id: "AzshS2",
                    description: "notification",
                }),
            });
            reset();
            refetch();
        }
    };

    const handlePageBulkRemove = (data: PageBulkRemove) => {
        if (data.pageBulkDelete.errors.length === 0) {
            closeModal();
            notify({
                status: "success",
                text: intl.formatMessage({
                    defaultMessage: "Removed pages",
                    id: "41z2Qi",
                    description: "notification",
                }),
            });
            reset();
            refetch();
        }
    };

    const handleSort = createSortHandler(navigate, pageListUrl, params);

    return (
        <TypedPageBulkRemove onCompleted={handlePageBulkRemove}>
            {(bulkPageRemove, bulkPageRemoveOpts) => (
                <TypedPageBulkPublish onCompleted={handlePageBulkPublish}>
                    {(bulkPagePublish, bulkPagePublishOpts) => (
                        <>
                            <PageListPage
                                disabled={loading}
                                settings={settings}
                                pages={mapEdgesToItems(data?.pages)}
                                pageInfo={pageInfo}
                                onAdd={() => navigate(pageCreateUrl())}
                                onBack={() => navigate(configurationMenuUrl)}
                                onNextPage={loadNextPage}
                                onPreviousPage={loadPreviousPage}
                                onUpdateListSettings={updateListSettings}
                                onRowClick={(id) => () => navigate(pageUrl(id))}
                                onSort={handleSort}
                                toolbar={
                                    <>
                                        <Button
                                            color="primary"
                                            onClick={() =>
                                                openModal("unpublish", {
                                                    ids: listElements,
                                                })
                                            }
                                        >
                                            <FormattedMessage
                                                defaultMessage="Unpublish"
                                                id="F8gsds"
                                                description="unpublish page, button"
                                            />
                                        </Button>
                                        <Button
                                            color="primary"
                                            onClick={() =>
                                                openModal("publish", {
                                                    ids: listElements,
                                                })
                                            }
                                        >
                                            <FormattedMessage
                                                defaultMessage="Publish"
                                                id="yEmwxD"
                                                description="publish page, button"
                                            />
                                        </Button>
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                openModal("remove", {
                                                    ids: listElements,
                                                })
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                                isChecked={isSelected}
                                selected={listElements.length}
                                sort={getSortParams(params)}
                                toggle={toggle}
                                toggleAll={toggleAll}
                            />
                            <ActionDialog
                                open={params.action === "publish"}
                                onClose={closeModal}
                                confirmButtonState={bulkPagePublishOpts.status}
                                onConfirm={() =>
                                    bulkPagePublish({
                                        variables: {
                                            ids: params.ids,
                                            isPublished: true,
                                        },
                                    })
                                }
                                title={intl.formatMessage({
                                    defaultMessage: "Publish Pages",
                                    id: "wyvzh9",
                                    description: "dialog header",
                                })}
                            >
                                <DialogContentText>
                                    <FormattedMessage
                                        defaultMessage="{counter,plural,one{Are you sure you want to publish this page?} other{Are you sure you want to publish {displayQuantity} pages?}}"
                                        id="WRPQMM"
                                        description="dialog content"
                                        values={{
                                            counter: maybe(() => params.ids.length),
                                            displayQuantity: (
                                                <strong>{maybe(() => params.ids.length)}</strong>
                                            ),
                                        }}
                                    />
                                </DialogContentText>
                            </ActionDialog>
                            <ActionDialog
                                open={params.action === "unpublish"}
                                onClose={closeModal}
                                confirmButtonState={bulkPagePublishOpts.status}
                                onConfirm={() =>
                                    bulkPagePublish({
                                        variables: {
                                            ids: params.ids,
                                            isPublished: false,
                                        },
                                    })
                                }
                                title={intl.formatMessage({
                                    defaultMessage: "Unpublish Pages",
                                    id: "yHQQMQ",
                                    description: "dialog header",
                                })}
                            >
                                <FormattedMessage
                                    defaultMessage="{counter,plural,one{Are you sure you want to unpublish this page?} other{Are you sure you want to unpublish {displayQuantity} pages?}}"
                                    id="Wd8vG7"
                                    description="dialog content"
                                    values={{
                                        counter: maybe(() => params.ids.length),
                                        displayQuantity: (
                                            <strong>{maybe(() => params.ids.length)}</strong>
                                        ),
                                    }}
                                />
                            </ActionDialog>
                            <ActionDialog
                                open={params.action === "remove"}
                                onClose={closeModal}
                                confirmButtonState={bulkPageRemoveOpts.status}
                                onConfirm={() =>
                                    bulkPageRemove({
                                        variables: {
                                            ids: params.ids,
                                        },
                                    })
                                }
                                variant="delete"
                                title={intl.formatMessage({
                                    defaultMessage: "Delete Pages",
                                    id: "3Sz1/t",
                                    description: "dialog header",
                                })}
                            >
                                <FormattedMessage
                                    defaultMessage="{counter,plural,one{Are you sure you want to delete this page?} other{Are you sure you want to delete {displayQuantity} pages?}}"
                                    id="UNwG+4"
                                    description="dialog content"
                                    values={{
                                        counter: maybe(() => params.ids.length),
                                        displayQuantity: (
                                            <strong>{maybe(() => params.ids.length)}</strong>
                                        ),
                                    }}
                                />
                            </ActionDialog>
                        </>
                    )}
                </TypedPageBulkPublish>
            )}
        </TypedPageBulkRemove>
    );
};

export default PageList;
