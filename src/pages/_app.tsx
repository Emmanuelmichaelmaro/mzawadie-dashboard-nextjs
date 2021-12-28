import { AppChannelProvider } from "@mzawadie/components/AppLayout/AppChannelContext";
import { DateProvider } from "@mzawadie/components/Date";
import { LocaleProvider } from "@mzawadie/components/Locale";
import MessageManagerProvider from "@mzawadie/components/Messages";
import { ShopProvider } from "@mzawadie/components/Shop";
import AppStateProvider from "@mzawadie/containers/AppState";
import BackgroundTasksProvider from "@mzawadie/containers/BackgroundTasks";
import themeOverrides, { API_URI, CHANNEL_SLUG } from "@mzawadie/core";
import { MzawadieProvider } from "@mzawadie/sdk/lib/src";
import { ConfigInput } from "@mzawadie/sdk/lib/src/types";
import { PermissionEnum } from "@mzawadie/types/globalTypes";
import { AuthGuard } from "@mzawadie/views/auth/AuthGuard";
import { NextPage } from "next";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import React from "react";

import "../styles/globals.scss";

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

const mzawadieConfig: ConfigInput = { apiUrl: API_URI, channel: CHANNEL_SLUG };

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
    permissions?: PermissionEnum[];
    layout?: any;
};

const MyApp = (props: AppProps) => {
    // @ts-ignore
    const { Component, pageProps }: { Component: NextApplicationPage; pageProps: any } = props;

    const Layout = Component.layout || ((children: any) => <>{children}</>);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>PWA Dashboard – Mzawadie Commerce</title>
                <link rel="icon" type="image/png" href="/favicon-36.png" />
                <link rel="manifest" href="/manifest.json" />
            </Head>

            <ThemeProvider overrides={themeOverrides}>
                <DateProvider>
                    <LocaleProvider>
                        <MessageManagerProvider>
                            <MzawadieProvider config={mzawadieConfig}>
                                <BackgroundTasksProvider>
                                    <AppStateProvider>
                                        <ShopProvider>
                                            <AppChannelProvider>
                                                <AuthGuard>
                                                    <Layout>
                                                        <Component {...pageProps} />
                                                    </Layout>
                                                </AuthGuard>
                                            </AppChannelProvider>
                                        </ShopProvider>
                                    </AppStateProvider>
                                </BackgroundTasksProvider>
                            </MzawadieProvider>
                        </MessageManagerProvider>
                    </LocaleProvider>
                </DateProvider>
            </ThemeProvider>
        </>
    );
};

export default MyApp;
