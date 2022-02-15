import { ThemeProvider } from "@saleor/macaw-ui";
import React from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { Provider as DateProvider } from "../src/components/Date/DateContext";
import { Locale, RawLocaleProvider } from "../src/components/Locale";
import { TimezoneProvider } from "../src/components/Timezone";
import MessageManagerProvider from "../src/components/messages";
import { APP_MOUNT_URI } from "../src/core/config";
import themeOverrides from "../src/core/themeOverrides";

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
                        <BrowserRouter basename={APP_MOUNT_URI}>
                            <MessageManagerProvider>
                                <div
                                    style={{
                                        padding: 24
                                    }}
                                >
                                    {storyFn()}
                                </div>
                            </MessageManagerProvider>
                        </BrowserRouter>
                    </ThemeProvider>
                </TimezoneProvider>
            </DateProvider>
        </RawLocaleProvider>
    </IntlProvider>
);

export default Decorator;
