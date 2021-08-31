import { ApolloProvider } from "@apollo/client"
import { Theme } from "@material-ui/core/styles"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import "tailwindcss/tailwind.css"

import client from "../../lib/graphql"
import AuthProvider from "../auth/AuthProvider"
import AppLayout from "../components/AppLayout"
import { DateProvider } from "../components/Date"
import { LocaleProvider } from "../components/Locale"
import { ShopProvider } from "../components/Shop"
import MessageManagerProvider from "../components/messages"
import AppStateProvider from "../containers/AppState"
import useAppState from "../hooks/useAppState"
import errorTracker from "../services/errorTracking"

errorTracker.init()

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}

const ThemeProvider = dynamic(
    () => import("@saleor/macaw-ui").then((module_) => module_.ThemeProvider),
    { ssr: false }
)

const themeOverrides: Partial<Theme> = {
    overrides: {
        MuiTableCell: {
            body: {
                paddingBottom: 8,
                paddingTop: 8,
            },
            root: {
                height: 56,
                padding: "4px 24px",
            },
        },
    },
}

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [, dispatchAppState] = useAppState()

    return (
        <ApolloProvider client={client}>
            <ThemeProvider overrides={themeOverrides}>
                <DateProvider>
                    <LocaleProvider>
                        {/* <MessageManagerProvider> */}
                        {/* <AppStateProvider> */}
                        {/* <ShopProvider> */}
                        {/* <AuthProvider> */}
                        <AppLayout>
                            <ErrorBoundary
                                FallbackComponent={ErrorFallback}
                                onError={(e) => {
                                    const errorId = errorTracker.captureException(e)

                                    dispatchAppState({
                                        payload: {
                                            error: "unhandled",
                                            errorId,
                                        },
                                        type: "displayError",
                                    })
                                }}
                            >
                                <Component {...pageProps} />
                            </ErrorBoundary>
                        </AppLayout>
                        {/* </AuthProvider> */}
                        {/* </ShopProvider> */}
                        {/* </AppStateProvider> */}
                        {/* </MessageManagerProvider> */}
                    </LocaleProvider>
                </DateProvider>
            </ThemeProvider>
        </ApolloProvider>
    )
}

export default MyApp
