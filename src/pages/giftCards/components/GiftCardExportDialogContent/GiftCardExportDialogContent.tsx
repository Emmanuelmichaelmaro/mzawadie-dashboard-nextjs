// @ts-nocheck
import { DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { ConfirmButton } from "@mzawadie/components/ConfirmButton";
import { Task } from "@mzawadie/containers/BackgroundTasks/types";
import { DialogProps } from "@mzawadie/core";
import useBackgroundTask from "@mzawadie/hooks/useBackgroundTask";
import useForm from "@mzawadie/hooks/useForm";
import { useNotifier } from "@mzawadie/hooks/useNotifier";
import ExportDialogSettings from "@mzawadie/pages/products/components/ProductExportDialog/ExportDialogSettings";
import {
    ExportSettingsFormData,
    exportSettingsInitialFormData,
    exportSettingsInitialFormDataWithIds,
} from "@mzawadie/pages/products/components/ProductExportDialog/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ContentWithProgress from "../GiftCardCreateDialog/ContentWithProgress";
import useGiftCardList from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../GiftCardsList/providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { useGiftCardTotalCountQuery } from "../GiftCardsList/queries";
import { giftCardExportDialogMessages as messages } from "./messages";
import { useGiftCardExportMutation } from "./mutations";
import useStyles from "./styles";
import { ExportGiftCards } from "./types/ExportGiftCards";
import { getExportGiftCardsInput } from "./utils";

const GiftCardExportDialog: React.FC<
    Pick<DialogProps, "onClose"> & {
        idsToExport?: string[] | null;
    }
> = ({ onClose, idsToExport }) => {
    const intl = useIntl();
    const notify = useNotifier();
    const { queue } = useBackgroundTask();
    const classes = useStyles();

    const hasIdsToExport = !!idsToExport?.length;

    const { loading: loadingGiftCardList, totalCount: filteredGiftCardsCount } = useGiftCardList();

    const { listElements } = useGiftCardListBulkActions();

    const selectedIds = idsToExport ?? listElements;

    const { data: allGiftCardsCountData, loading: loadingGiftCardCount } = useGiftCardTotalCountQuery();

    const loading = loadingGiftCardList || loadingGiftCardCount;

    const handleSubmitComplete = (data: ExportGiftCards) => {
        const errors = data?.exportGiftCards?.errors;

        if (!errors.length) {
            notify({
                text: intl.formatMessage(messages.successAlertDescription),
                title: intl.formatMessage(messages.successAlertTitle),
            });

            queue(Task.EXPORT, {
                id: data.exportGiftCards.exportFile.id,
            });

            onClose();
        }
    };

    const [exportGiftCards, exportGiftCardsOpts] = useGiftCardExportMutation({
        onCompleted: handleSubmitComplete,
    });

    const handleSubmit = (data: ExportSettingsFormData) => {
        exportGiftCards({
            variables: {
                input: getExportGiftCardsInput({
                    data,
                    ids: selectedIds,
                }),
            },
        });
    };

    const { data, change, submit } = useForm(
        hasIdsToExport ? exportSettingsInitialFormDataWithIds : exportSettingsInitialFormData,
        handleSubmit
    );
    const allGiftCardsCount = allGiftCardsCountData?.giftCards?.totalCount;

    const exportScopeLabels = {
        allItems: intl.formatMessage(
            {
                defaultMessage: "All gift cards ({number})",
                id: "uQk8gB",
                description: "export all items to csv file",
            },
            {
                number: allGiftCardsCount || "...",
            }
        ),
        selectedItems: intl.formatMessage(
            {
                defaultMessage: "Selected giftCards ({number})",
                id: "n97Ii0",
                description: "export selected items to csv file",
            },
            {
                number: listElements.length,
            }
        ),
    };

    return (
        <>
            <DialogTitle>
                <FormattedMessage {...messages.title} />
            </DialogTitle>
            <DialogContent>
                <ContentWithProgress>
                    {!loading && (
                        <>
                            <ExportDialogSettings
                                errors={exportGiftCardsOpts?.data?.exportGiftCards?.errors}
                                onChange={change}
                                selectedItems={selectedIds?.length}
                                data={data}
                                exportScopeLabels={exportScopeLabels}
                                allowScopeSelection={!hasIdsToExport}
                                itemsQuantity={{
                                    filter: filteredGiftCardsCount,
                                    all: allGiftCardsCount,
                                }}
                            />
                            <Typography className={classes.note} variant="body2">
                                {intl.formatMessage(messages.exportNote)}
                            </Typography>
                        </>
                    )}
                </ContentWithProgress>
            </DialogContent>
            <DialogActions>
                <ConfirmButton
                    transitionState={exportGiftCardsOpts.status}
                    variant="primary"
                    type="submit"
                    data-test="submit"
                    onClick={submit}
                >
                    <FormattedMessage {...messages.confirmButtonLabel} />
                </ConfirmButton>
            </DialogActions>
        </>
    );
};

export default GiftCardExportDialog;
