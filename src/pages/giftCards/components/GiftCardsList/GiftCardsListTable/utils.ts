import { GiftCardDataFragment } from "@mzawadie/graphql";

import { PLACEHOLDER } from "../../GiftCardUpdate/types";

export const getTagCellText = (tags: GiftCardDataFragment["tags"]) => {
    if (!!tags.length) {
        return tags.map(({ name }) => name).join(", ");
    }

    return PLACEHOLDER;
};
