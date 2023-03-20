// @ts-nocheck
import { Dialog } from "@material-ui/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { GiftCardBulkCreateDialog } from "@mzawadie/pages/giftCards/components/GiftCardBulkCreateDialog";
import { GiftCardCreateDialogContent } from "@mzawadie/pages/giftCards/components/GiftCardCreateDialog";
import GiftCardListPageDeleteDialog from "@mzawadie/pages/giftCards/components/GiftCardDeleteDialog/GiftCardListPageDeleteDialog";
import { GiftCardExportDialogContent } from "@mzawadie/pages/giftCards/components/GiftCardExportDialogContent";
import { GIFT_CARD_LIST_QUERY } from "@mzawadie/pages/giftCards/components/GiftCardsList/queries";
import { giftCardListUrl } from "@mzawadie/pages/giftCards/urls";
import createDialogActionHandlers from "@mzawadie/utils/handlers/dialogActionHandlers";
import React, { createContext, useContext } from "react";

import { GiftCardListActionParamsEnum, GiftCardListUrlQueryParams } from "../../types";

export const useGiftCardListDialogs = () => useContext(GiftCardListDialogsContext);

interface GiftCardListDialogsProviderProps {
    children: React.ReactNode;
    params: GiftCardListUrlQueryParams;
}

export interface GiftCardListDialogsConsumerProps {
    openCreateDialog: () => void;
    openBulkCreateDialog: () => void;
    openDeleteDialog: (id?: string | React.MouseEvent) => void;
    openSearchSaveDialog: () => void;
    openSearchDeleteDialog: () => void;
    onClose: () => void;
    openExportDialog: () => void;
    id: string;
}

export const GiftCardListDialogsContext = createContext<GiftCardListDialogsConsumerProps>(null);

const GiftCardListDialogsProvider: React.FC<GiftCardListDialogsProviderProps> = ({
    children,
    params,
}) => {
    const navigate = useNavigator();

    const id = params?.id;

    const { CREATE, DELETE, EXPORT, BULK_CREATE } = GiftCardListActionParamsEnum;

    const [openDialog, onClose] = createDialogActionHandlers<
        GiftCardListActionParamsEnum,
        GiftCardListUrlQueryParams
    >(navigate, giftCardListUrl, params);

    const handleOpenDialog = (type: GiftCardListActionParamsEnum) => () => openDialog(type);

    const isDialogOpen = (type: GiftCardListActionParamsEnum) => params?.action === type;

    const handleDeleteDialogOpen = (id?: string) => {
        openDialog(DELETE, id ? { id } : undefined);
    };

    const openSearchDeleteDialog = () => openDialog(GiftCardListActionParamsEnum.DELETE_SEARCH);

    const openSearchSaveDialog = () => openDialog(GiftCardListActionParamsEnum.SAVE_SEARCH);

    const providerValues: GiftCardListDialogsConsumerProps = {
        openCreateDialog: handleOpenDialog(CREATE),
        openExportDialog: handleOpenDialog(EXPORT),
        openBulkCreateDialog: handleOpenDialog(BULK_CREATE),
        openDeleteDialog: handleDeleteDialogOpen,
        openSearchSaveDialog,
        openSearchDeleteDialog,
        onClose,
        id,
    };

    return (
        <GiftCardListDialogsContext.Provider value={providerValues}>
            {children}
            <Dialog open={isDialogOpen(CREATE)} maxWidth="sm" onClose={onClose} fullWidth>
                <GiftCardCreateDialogContent
                    onClose={onClose}
                    refetchQueries={[GIFT_CARD_LIST_QUERY]}
                />
            </Dialog>
            <GiftCardListPageDeleteDialog open={isDialogOpen(DELETE)} onClose={onClose} />
            <Dialog open={isDialogOpen(EXPORT)} maxWidth="sm" onClose={onClose} fullWidth>
                <GiftCardExportDialogContent onClose={onClose} />
            </Dialog>
            <GiftCardBulkCreateDialog open={isDialogOpen(BULK_CREATE)} onClose={onClose} />
        </GiftCardListDialogsContext.Provider>
    );
};

export default GiftCardListDialogsProvider;
