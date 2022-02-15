import { TypeDeleteMessages } from "@mzawadie/components/TypeDeleteWarningDialog";
import { Ids } from "@mzawadie/core";

export interface UseTypeDeleteData extends TypeDeleteMessages {
    isOpen: boolean;
    assignedItemsCount: number | undefined;
    viewAssignedItemsUrl: string;
    isLoading: boolean | undefined;
    typesToDelete: Ids;
}

export interface UseTypeDeleteProps<T> {
    params: T;
    selectedTypes?: Ids;
    singleId?: string;
}
