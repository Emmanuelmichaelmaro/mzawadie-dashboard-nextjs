import { ShopInfo_shop_languages } from "@mzawadie/components/Shop/types/ShopInfo";
import { LanguageCodeEnum } from "@mzawadie/types/globalTypes";

export const languages: ShopInfo_shop_languages[] = [
    {
        __typename: "LanguageDisplay",
        code: LanguageCodeEnum.DE,
        language: "niemiecki",
    },
    {
        __typename: "LanguageDisplay",
        code: LanguageCodeEnum.EN,
        language: "angielski",
    },
    {
        __typename: "LanguageDisplay",
        code: LanguageCodeEnum.ES,
        language: "hiszpański",
    },
    {
        __typename: "LanguageDisplay",
        code: LanguageCodeEnum.PL,
        language: "polski",
    },
];
