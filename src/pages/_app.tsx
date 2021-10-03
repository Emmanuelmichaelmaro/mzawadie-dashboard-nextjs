import { ApolloProvider } from "@apollo/client";
import English from "@locale/compiled-locales/en.json";
import Español from "@locale/compiled-locales/es.json";
import Français from "@locale/compiled-locales/fr.json";
import Swahili from "@locale/compiled-locales/sw.json";
import { AuthProvider, useApollo } from "@mzawadie/auth";
import MessageManagerProvider from "@mzawadie/components/messages";
import { API_URI } from "@mzawadie/config";
import AppStateProvider from "@mzawadie/containers/AppState";
import themeOverrides from "@mzawadie/themeOverrides";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import React, { useMemo } from "react";
import { IntlProvider } from "react-intl";

import "../styles/globals.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const ThemeProvider = dynamic(
    async () => {
        const moduleS = await import("@saleor/macaw-ui");
        return moduleS.ThemeProvider;
    },
    { ssr: false }
);

const MyApp = ({ Component, pageProps, router }: AppProps) => {
    const apolloClient = useApollo(pageProps);

    const messages = useMemo(() => {
        switch (router.locale) {
            case "sw":
                return Swahili;
            case "fr":
                return Français;
            case "es":
                return Español;
            case "en":
                return English;
            default:
                return English;
        }
    }, [router.locale]);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <title>PWA Dashboard – Mzawadie Commerce</title>

                <link rel="preconnect" href={API_URI} />
                <link rel="icon" type="image/png" href="/favicon-36.png" />
                <link rel="manifest" href="/manifest.json" />
            </Head>

            <ApolloProvider client={apolloClient}>
                <ThemeProvider overrides={themeOverrides}>
                    <IntlProvider
                        locale={router.locale || "en"}
                        messages={messages}
                        onError={() => null}
                        defaultLocale={router.defaultLocale}
                    >
                        <MessageManagerProvider>
                            <AppStateProvider>
                                <AuthProvider>
                                    <Component {...pageProps} />
                                </AuthProvider>
                            </AppStateProvider>
                        </MessageManagerProvider>
                    </IntlProvider>
                </ThemeProvider>
            </ApolloProvider>
        </>
    );
};

export default MyApp;
