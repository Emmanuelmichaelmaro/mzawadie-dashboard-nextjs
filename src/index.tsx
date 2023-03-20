// @ts-nocheck
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import {
    ShopProvider,
    WindowTitle,
    DateProvider,
    DemoBanner,
    ErrorPage,
    LocaleProvider,
    MessageManagerProvider,
    NotFound as NotFoundPage,
    AppLayout,
    useAppChannel,
    AppChannelProvider,
    ExitFormDialogProvider,
} from "@mzawadie/components";
import { AppStateProvider } from "@mzawadie/containers/AppState";
import { AppStateReducerAction } from "@mzawadie/containers/AppState/reducer";
import { BackgroundTasksProvider } from "@mzawadie/containers/BackgroundTasks";
import errorTracker from "@mzawadie/containers/ErrorTracking";
import { API_URI, commonMessages, DEMO_MODE, getAppMountUri } from "@mzawadie/core";
import themeOverrides from "@mzawadie/core/themeOverrides";
import { TypedTypePolicies, PermissionEnum, introspectionQueryResultData } from "@mzawadie/graphql";
import { useAppState } from "@mzawadie/hooks/useAppState";
import AppsPage from "@mzawadie/pages/apps";
import { ExternalAppProvider } from "@mzawadie/pages/apps/components/ExternalAppContext";
import AttributePage from "@mzawadie/pages/attributes";
import Auth, { useUser } from "@mzawadie/pages/auth";
import AuthProvider from "@mzawadie/pages/auth/AuthProvider";
import { LoginLoading, SectionRoute } from "@mzawadie/pages/auth/components";
import CategoryPage from "@mzawadie/pages/categories";
import ChannelsPage from "@mzawadie/pages/channels";
import CollectionPage from "@mzawadie/pages/collections";
import ConfigurationPage from "@mzawadie/pages/configuration";
import { getConfigMenuItemsPermissions } from "@mzawadie/pages/configuration/utils";
import CustomerPage from "@mzawadie/pages/customers";
import DiscountPage from "@mzawadie/pages/discounts";
import GiftCardPage from "@mzawadie/pages/giftCards";
import HomePage from "@mzawadie/pages/home";
import NavigationPage from "@mzawadie/pages/navigation";
import OrdersPage from "@mzawadie/pages/orders";
import PageTypesSection from "@mzawadie/pages/pageTypes";
import PageSection from "@mzawadie/pages/pages";
import PermissionGroupPage from "@mzawadie/pages/permissionGroups";
import PluginsPage from "@mzawadie/pages/plugins";
import ProductTypesPage from "@mzawadie/pages/productTypes";
import ProductPage from "@mzawadie/pages/products";
import ShippingPage from "@mzawadie/pages/shipping";
import SiteSettingsPage from "@mzawadie/pages/siteSettings";
import StaffPage from "@mzawadie/pages/staff";
import TaxesPage from "@mzawadie/pages/taxes";
import TranslationsPage from "@mzawadie/pages/translations";
import WarehousePage from "@mzawadie/pages/warehouses";
import { ThemeProvider } from "@saleor/macaw-ui";
import { createFetch, createSaleorClient, SaleorProvider } from "@saleor/sdk";
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { render } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useIntl } from "react-intl";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

errorTracker.init();

// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves,
// so we need to explicitly set them
const linkOptions = {
    credentials: "include",
    uri: API_URI,
    fetch: createFetch(),
};

const uploadLink = createUploadLink(linkOptions);

const batchLink = new BatchHttpLink({
    batchInterval: 100,
    ...linkOptions,
});

const link = ApolloLink.split((operation) => operation.getContext().useBatching, batchLink, uploadLink);

const apolloClient = new ApolloClient({
    cache: new InMemoryCache({
        possibleTypes: introspectionQueryResultData.possibleTypes,
        typePolicies: {
            CountryDisplay: {
                keyFields: ["code"],
            },
            Money: {
                merge: false,
            },
            TaxedMoney: {
                merge: false,
            },
            Weight: {
                merge: false,
            },
            Shop: {
                keyFields: [],
            },
        } as TypedTypePolicies,
    }),
    link,
    connectToDevTools: true,
});

const saleorClient = createSaleorClient({
    apiUrl: API_URI,
    channel: "default-channel",
});

const getFallbackRender =
    () =>
    ({ resetErrorBoundary }: any) =>
        <ErrorPage onBack={resetErrorBoundary} onRefresh={() => window.location.reload()} />;

const getOnError = (dispatchAppState: (value: AppStateReducerAction) => void) => (e: Error) => {
    const errorId = errorTracker.captureException(e);

    dispatchAppState({
        payload: {
            error: "unhandled",
            errorId,
        },
        type: "displayError",
    });
};

const Routes: React.FC = () => {
    const intl = useIntl();

    const [, dispatchAppState] = useAppState();

    const { authenticated, authenticating } = useUser();

    const { channel } = useAppChannel(false);

    const channelLoaded = typeof channel !== "undefined";

    const homePageLoaded = channelLoaded && authenticated;

    const homePageLoading = (authenticated && !channelLoaded) || authenticating;

    return (
        <>
            <WindowTitle title={intl.formatMessage(commonMessages.dashboard)} />

            {DEMO_MODE && <DemoBanner />}

            {homePageLoaded ? (
                <AppLayout>
                    <ErrorBoundary
                        fallbackRender={getFallbackRender()}
                        onError={getOnError(dispatchAppState)}
                    >
                        <Switch>
                            <SectionRoute exact path="/" component={HomePage} />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_USERS]}
                                path="/customers"
                                component={CustomerPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_STAFF]}
                                path="/staff"
                                component={StaffPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_STAFF]}
                                path="/permission-groups"
                                component={PermissionGroupPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PAGES]}
                                path="/pages"
                                component={PageSection}
                            />

                            <SectionRoute
                                permissions={[
                                    PermissionEnum.MANAGE_PAGES,
                                    PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                                ]}
                                path="/page-types"
                                component={PageTypesSection}
                                matchPermission="any"
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_MENUS]}
                                path="/navigation"
                                component={NavigationPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                                path="/site-settings"
                                component={SiteSettingsPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_CHANNELS]}
                                path="/channels"
                                component={ChannelsPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path="/warehouses"
                                component={WarehousePage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_SHIPPING]}
                                path="/shipping"
                                component={ShippingPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                                path="/taxes"
                                component={TaxesPage}
                            />

                            <SectionRoute
                                matchPermission="any"
                                permissions={getConfigMenuItemsPermissions(intl)}
                                exact
                                path="/configuration"
                                component={ConfigurationPage}
                            />

                            <SectionRoute
                                permissions={[
                                    PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
                                    PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES,
                                ]}
                                path="/attributes"
                                component={AttributePage}
                                matchPermission="any"
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path="/categories"
                                component={CategoryPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path="/collections"
                                component={CollectionPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES]}
                                path="/product-types"
                                component={ProductTypesPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path="/products"
                                component={ProductPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_GIFT_CARD]}
                                path="/gift-cards"
                                component={GiftCardPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                                path="/discounts"
                                component={DiscountPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_ORDERS]}
                                path="/orders"
                                component={OrdersPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}
                                path="/translations"
                                component={TranslationsPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PLUGINS]}
                                path="/plugins"
                                component={PluginsPage}
                            />

                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_APPS]}
                                path="/apps"
                                component={AppsPage}
                            />

                            <Route component={NotFoundPage} />
                        </Switch>
                    </ErrorBoundary>
                </AppLayout>
            ) : homePageLoading ? (
                <LoginLoading />
            ) : (
                <Auth />
            )}
        </>
    );
};

const App: React.FC = () => (
    <SaleorProvider client={saleorClient}>
        <ApolloProvider client={apolloClient}>
            <BrowserRouter basename={getAppMountUri()}>
                <ThemeProvider overrides={themeOverrides}>
                    <DateProvider>
                        <LocaleProvider>
                            <MessageManagerProvider>
                                <BackgroundTasksProvider>
                                    <AppStateProvider>
                                        <AuthProvider>
                                            <ShopProvider>
                                                <AppChannelProvider>
                                                    <ExternalAppProvider>
                                                        <ExitFormDialogProvider>
                                                            <Routes />
                                                        </ExitFormDialogProvider>
                                                    </ExternalAppProvider>
                                                </AppChannelProvider>
                                            </ShopProvider>
                                        </AuthProvider>
                                    </AppStateProvider>
                                </BackgroundTasksProvider>
                            </MessageManagerProvider>
                        </LocaleProvider>
                    </DateProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ApolloProvider>
    </SaleorProvider>
);

render(<App />, document.querySelector("#dashboard-app"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
