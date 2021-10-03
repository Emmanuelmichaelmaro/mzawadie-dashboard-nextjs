interface StructuredMessage {
    context?: string;
    string: string;
}
export declare type LocaleMessages = Record<string, StructuredMessage>;
export declare enum Locale {
    EN = "en",
    AR = "ar",
    AZ = "az",
    BG = "bg",
    BN = "bn",
    CA = "ca",
    CS = "cs",
    DA = "da",
    DE = "de",
    EL = "el",
    ES = "es",
    ES_CO = "es-CO",
    ET = "et",
    FA = "fa",
    FR = "fr",
    HI = "hi",
    HU = "hu",
    HY = "hy",
    ID = "id",
    IS = "is",
    IT = "it",
    JA = "ja",
    KO = "ko",
    MN = "mn",
    NB = "nb",
    NL = "nl",
    PL = "pl",
    PT = "pt",
    PT_BR = "pt-BR",
    RO = "ro",
    RU = "ru",
    SK = "sk",
    SL = "sl",
    SQ = "sq",
    SR = "sr",
    SV = "sv",
    SW = "sw",
    TH = "th",
    TR = "tr",
    UK = "uk",
    VI = "vi",
    ZH_HANS = "zh-Hans",
    ZH_HANT = "zh-Hant"
}
export declare const localeData: Record<Locale, string | undefined>;
export declare const loadMessagesJson: (locale?: Locale | undefined) => Promise<LocaleMessages | undefined>;
export declare function getKeyValueJson(messages: LocaleMessages | undefined): Record<string, string> | undefined;
export declare function getMatchingLocale(languages: readonly string[]): Locale | undefined;
export {};
