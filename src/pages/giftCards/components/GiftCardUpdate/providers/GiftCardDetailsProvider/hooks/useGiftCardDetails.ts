import { useContext } from "react";

import { GiftCardDetailsConsumerProps, GiftCardDetailsContext } from "../GiftCardDetailsProvider";

const useGiftCardDetails = (): GiftCardDetailsConsumerProps => useContext(GiftCardDetailsContext);

export default useGiftCardDetails;
