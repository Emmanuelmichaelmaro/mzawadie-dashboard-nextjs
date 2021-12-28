/* eslint-disable no-restricted-syntax */
interface StructuredMessage {
    context?: string;
    string: string;
}

export type LocaleMessages = Record<string, StructuredMessage>;

export enum Locale {
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
    ZH_HANT = "zh-Hant",
}

export const localeData: Record<Locale, string | undefined> = {
    [Locale.EN]: undefined,
    [Locale.AR]: "العربيّة",
    [Locale.AZ]: "Azərbaycanca",
    [Locale.BG]: "български",
    [Locale.BN]: "বাংলা",
    [Locale.CA]: "català",
    [Locale.CS]: "česky",
    [Locale.DA]: "dansk",
    [Locale.DE]: "Deutsch",
    [Locale.EL]: "Ελληνικά",
    [Locale.ES]: "español",
    [Locale.ES_CO]: "español de Colombia",
    [Locale.ET]: "eesti",
    [Locale.FA]: "فارسی",
    [Locale.FR]: "français",
    [Locale.HI]: "Hindi",
    [Locale.HU]: "Magyar",
    [Locale.HY]: "հայերեն",
    [Locale.ID]: "Bahasa Indonesia",
    [Locale.IS]: "Íslenska",
    [Locale.IT]: "italiano",
    [Locale.JA]: "日本語",
    [Locale.KO]: "한국어",
    [Locale.MN]: "Mongolian",
    [Locale.NB]: "norsk (bokmål)",
    [Locale.NL]: "Nederlands",
    [Locale.PL]: "polski",
    [Locale.PT]: "Português",
    [Locale.PT_BR]: "Português Brasileiro",
    [Locale.RO]: "Română",
    [Locale.RU]: "Русский",
    [Locale.SK]: "Slovensky",
    [Locale.SL]: "Slovenščina",
    [Locale.SQ]: "shqip",
    [Locale.SR]: "српски",
    [Locale.SV]: "svenska",
    [Locale.SW]: "swahili",
    [Locale.TH]: "ภาษาไทย",
    [Locale.TR]: "Türkçe",
    [Locale.UK]: "Українська",
    [Locale.VI]: "Tiếng Việt",
    [Locale.ZH_HANS]: "简体中文",
    [Locale.ZH_HANT]: "繁體中文",
};

const dotSeparator = "_dot_";

const separatorRegExp = new RegExp(dotSeparator, "g");

const LOCALE_CACHE: { [key in Locale]?: LocaleMessages } = {};

export const loadMessagesJson = async (locale: Locale | undefined = Locale.EN) => {
    const filename = localeData[locale];
    let localeJson = LOCALE_CACHE[locale];

    if (!localeJson && filename !== undefined) {
        console.log(filename);
        localeJson = await import(`../../../locale/${filename}.json`);
        LOCALE_CACHE[locale] = localeJson;
    }

    return localeJson;
};

export function getKeyValueJson(
    messages: LocaleMessages | undefined
): Record<string, string> | undefined {
    if (messages) {
        const keyValueMessages: Record<string, string> = {};
        return Object.entries(messages).reduce((accumulator, [id, message]) => {
            accumulator[id.replace(separatorRegExp, ".")] = message.string;
            return accumulator;
        }, keyValueMessages);
    }

    return undefined;
}

export function getMatchingLocale(languages: readonly string[]): Locale | undefined {
    const localeEntries = Object.entries(Locale);

    for (const preferredLocale of languages) {
        for (const localeEntry of localeEntries) {
            if (localeEntry[1].toLowerCase() === preferredLocale.toLowerCase()) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return Locale[localeEntry[0]];
            }
        }
    }

    return undefined;
}
