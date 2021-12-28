import { ThemeProvider } from "@saleor/macaw-ui";
import React from "react";
import IntlProvider from "react-intl/src/components/provider";

import { DateProvider } from "../src/components/Date";
import { Locale, RawLocaleProvider } from "../src/components/Locale";
import MessageManagerProvider from "../src/components/Messages";
import { TimezoneProvider } from "../src/components/Timezone";
import themeOverrides from "../src/core";

export const Decorator = storyFn => (
    <IntlProvider defaultLocale={Locale.EN} locale={Locale.EN}>
        <RawLocaleProvider
            value={{
                locale: Locale.EN,
                setLocale: () => undefined
            }}
        >
            <DateProvider value={+new Date("2018-08-07T14:30:44+00:00")}>
                <TimezoneProvider value="America/New_York">
                    <ThemeProvider overrides={themeOverrides}>
                        <MessageManagerProvider>
                            <div
                                style={{
                                    padding: 24
                                }}
                            >
                                {storyFn()}
                            </div>
                        </MessageManagerProvider>
                    </ThemeProvider>
                </TimezoneProvider>
            </DateProvider>
        </RawLocaleProvider>
    </IntlProvider>
);

export default Decorator;
