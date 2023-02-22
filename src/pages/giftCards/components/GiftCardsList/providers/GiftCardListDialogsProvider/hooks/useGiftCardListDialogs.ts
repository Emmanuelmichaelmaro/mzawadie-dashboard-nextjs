import { useContext } from "react";

import {
    GiftCardListDialogsConsumerProps,
    GiftCardListDialogsContext,
} from "../GiftCardListDialogsProvider";

const useGiftCardListDialogs = (): GiftCardListDialogsConsumerProps =>
    useContext(GiftCardListDialogsContext);

export default useGiftCardListDialogs;
