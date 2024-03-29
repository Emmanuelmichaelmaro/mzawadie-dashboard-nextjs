// @ts-nocheck
import { BulkAction, Dialog, SingleAction } from "@mzawadie/core";
import { UseNavigatorResult } from "@mzawadie/hooks";

type Url<T extends Dialog<any>> = (params: T) => string;
type CreateCloseModal<TAction extends string, TParams extends Dialog<TAction>> = [
    (action: TAction, newParams?: TParams) => void,
    () => void
];

export interface DialogActionHandlers {
    onClose: () => void;
    open: boolean;
}

function createDialogActionHandlers<
    TAction extends string,
    TParams extends Dialog<TAction> & BulkAction & SingleAction
>(
    navigate: UseNavigatorResult,
    url: Url<TParams>,
    params: TParams
): CreateCloseModal<TAction, TParams> {
    const close = () =>
        navigate(
            url({
                ...params,
                action: undefined,
                id: undefined,
                ids: undefined,
            }),
            true
        );
    const open = (action: TAction, newParams?: TParams) =>
        navigate(
            url({
                ...params,
                ...newParams,
                action,
            })
        );

    return [open, close];
}

export default createDialogActionHandlers;
