/* eslint-disable
react/prop-types,
prettier/prettier,
react-hooks/exhaustive-deps,
@typescript-eslint/ban-ts-comment,
@typescript-eslint/naming-convention
*/
import "@formatjs/intl-datetimeformat/add-all-tz";
import "@formatjs/intl-datetimeformat/locale-data/en";
import "@formatjs/intl-datetimeformat/locale-data/es";
import "@formatjs/intl-datetimeformat/locale-data/fr";
import "@formatjs/intl-datetimeformat/locale-data/sw";
import "@formatjs/intl-datetimeformat/polyfill";
import "@formatjs/intl-displaynames/locale-data/en";
import "@formatjs/intl-displaynames/locale-data/es";
import "@formatjs/intl-displaynames/locale-data/fr";
import "@formatjs/intl-displaynames/locale-data/sw";
import "@formatjs/intl-displaynames/polyfill";
import "@formatjs/intl-getcanonicallocales/polyfill";
import "@formatjs/intl-listformat/locale-data/en";
import "@formatjs/intl-listformat/locale-data/es";
import "@formatjs/intl-listformat/locale-data/fr";
import "@formatjs/intl-listformat/locale-data/sw";
import "@formatjs/intl-listformat/polyfill";
import "@formatjs/intl-locale/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";
import "@formatjs/intl-numberformat/locale-data/es";
import "@formatjs/intl-numberformat/locale-data/fr";
import "@formatjs/intl-numberformat/locale-data/sw";
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-pluralrules/locale-data/en";
import "@formatjs/intl-pluralrules/locale-data/es";
import "@formatjs/intl-pluralrules/locale-data/fr";
import "@formatjs/intl-pluralrules/locale-data/sw";
import "@formatjs/intl-pluralrules/polyfill";
import "@formatjs/intl-relativetimeformat/locale-data/en";
import "@formatjs/intl-relativetimeformat/locale-data/es";
import "@formatjs/intl-relativetimeformat/locale-data/fr";
import "@formatjs/intl-relativetimeformat/locale-data/sw";
import "@formatjs/intl-relativetimeformat/polyfill";
import React from "react";
import { IntlProvider, ReactIntlErrorCode } from "react-intl";

import useLocalStorage from "../../hooks/useLocalStorage";
import { getKeyValueJson, getMatchingLocale, Locale } from "./utils";

const defaultLocale = Locale.EN;

export interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const LocaleContext = React.createContext<LocaleContextType>({
    locale: defaultLocale,
    setLocale: () => undefined,
});

const { Consumer: LocaleConsumer, Provider: RawLocaleProvider } = LocaleContext;

// interface LocaleProviderProps {
//     messages: LocaleMessages;
// }

const LocaleProvider: React.FC = ({ children }) => {
    const [locale, setLocale] = useLocalStorage("locale", defaultLocale);

    React.useEffect(() => {
        setLocale(getMatchingLocale(navigator.languages) || defaultLocale);
    }, []);

    // @ts-ignore
    const [i10nMessages, seti10nMessages] = React.useState();

    React.useEffect(() => {
        async function changeLocale() {
            if (locale !== defaultLocale) {
                // It seems like Webpack is unable to use aliases for lazy imports
                const module = await import(`../../../locale/${locale}.json`);
                seti10nMessages(module.default);
            } else {
                seti10nMessages(undefined);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        changeLocale();
    }, [locale]);

    return (
        <IntlProvider
            key="en"
            locale="en"
            messages={getKeyValueJson(i10nMessages)}
            defaultLocale={defaultLocale}
            onError={(error) => {
                if (!(error.code === ReactIntlErrorCode.MISSING_TRANSLATION)) {
                    console.error(error);
                }
                if (!(error.code === ReactIntlErrorCode.MISSING_DATA)) {
                    console.error(error);
                }
                console.error(error);
            }}
        >
            <RawLocaleProvider value={{ locale, setLocale }}>{children}</RawLocaleProvider>
        </IntlProvider>
    );
};

export { Locale, LocaleConsumer, LocaleProvider, RawLocaleProvider };
