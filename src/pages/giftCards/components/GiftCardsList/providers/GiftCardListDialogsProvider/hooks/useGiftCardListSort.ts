import { SortPage } from "@mzawadie/core";

import { GiftCardUrlSortField } from "../../../types";
import useGiftCardList from "../../GiftCardListProvider/hooks/useGiftCardList";

type GiftCardSortListProps = SortPage<GiftCardUrlSortField>;

const useGiftCardListSort = (): GiftCardSortListProps => {
    const { onSort, sort } = useGiftCardList();

    return { onSort, sort };
};

export default useGiftCardListSort;
