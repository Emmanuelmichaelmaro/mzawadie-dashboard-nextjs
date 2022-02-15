// @ts-nocheck
import {
    ApolloLink,
    ApolloClient,
    InMemoryCache,
    defaultDataIdFromObject,
    ApolloProvider,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { ThemeProvider } from "@saleor/macaw-ui";
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { render } from "react-dom";
import ErrorBoundary from "react-error-boundary";
import { useIntl } from "react-intl";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFound from "./NotFound";
import AppLayout from "./components/AppLayout";
import useAppChannel, { AppChannelProvider } from "./components/AppLayout/AppChannelContext";
import { DateProvider } from "./components/Date";
import { LocaleProvider } from "./components/Locale";
import MessageManagerProvider from "./components/Messages";
import { ShopProvider } from "./components/Shop";
import { WindowTitle } from "./components/WindowTitle";
import AppStateProvider from "./containers/AppState";
import BackgroundTasksProvider from "./containers/BackgroundTasks";
import ServiceWorker from "./containers/ServiceWorker/ServiceWorker";
import themeOverrides, { API_URI, APP_MOUNT_URI, commonMessages } from "./core";
import useAppState from "./hooks/useAppState";
import errorTracker from "./services/errorTracking";
import { PermissionEnum } from "./types/globalTypes";
import AppsSection from "./views/apps";
import { appsSection } from "./views/apps/urls";
import AttributeSection from "./views/attributes";
import { attributeSection } from "./views/attributes/urls";
import Auth from "./views/auth";
import AuthProvider, { useAuth } from "./views/auth/AuthProvider";
import { LoginLoading, SectionRoute } from "./views/auth/components";
import authLink from "./views/auth/link";
import { hasPermission } from "./views/auth/misc";
import CategorySection from "./views/categories";
import ChannelsSection from "./views/channels";
import { channelsSection } from "./views/channels/urls";
import CollectionSection from "./views/collections";
import ConfigurationSection, { createConfigurationMenu } from "./views/configuration";
import { CustomerSection } from "./views/customers";
import DiscountSection from "./views/discounts";
import HomePage from "./views/home";
import NavigationSection from "./views/navigation";
import { navigationSection } from "./views/navigation/urls";
import OrdersSection from "./views/orders";
import PageTypesSection from "./views/pageTypes";
import PageSection from "./views/pages";
import PermissionGroupSection from "./views/permissionGroups";
import PluginsSection from "./views/plugins";
import ProductTypesSection from "./views/productTypes";
import ProductSection from "./views/products";
import ShippingSection from "./views/shipping";
import SiteSettingsSection from "./views/siteSettings";
import StaffSection from "./views/staff";
import TaxesSection from "./views/taxes";
import TranslationsSection from "./views/translations";
import WarehouseSection from "./views/warehouses";
import { warehouseSection } from "./views/warehouses/urls";

errorTracker.init();

// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
// so we need to explicitly set them
const linkOptions = {
    credentials: "include",
    uri: API_URI,
};

const uploadLink = createUploadLink(linkOptions);

const batchLink = new BatchHttpLink({
    batchInterval: 100,
    ...linkOptions,
});

const link = ApolloLink.split((operation) => operation.getContext().useBatching, batchLink, uploadLink);

const apolloClient = new ApolloClient({
    cache: new InMemoryCache({
        dataIdFromObject: (obj: any) => {
            // We need to set manually shop's ID, since it is singleton and
            // API does not return its ID
            if (obj.__typename === "Shop") {
                return "shop";
            }
            return defaultDataIdFromObject(obj);
        },
    }),
    link: authLink.concat(link),
});

const App: React.FC = () => (
    <ApolloProvider client={apolloClient}>
        <BrowserRouter basename={APP_MOUNT_URI}>
            <ThemeProvider overrides={themeOverrides}>
                <DateProvider>
                    <LocaleProvider>
                        <MessageManagerProvider>
                            <ServiceWorker />

                            <BackgroundTasksProvider>
                                <AppStateProvider>
                                    <ShopProvider>
                                        <AuthProvider>
                                            <AppChannelProvider>
                                                <Routes />
                                            </AppChannelProvider>
                                        </AuthProvider>
                                    </ShopProvider>
                                </AppStateProvider>
                            </BackgroundTasksProvider>
                        </MessageManagerProvider>
                    </LocaleProvider>
                </DateProvider>
            </ThemeProvider>
        </BrowserRouter>
    </ApolloProvider>
);

const Routes: React.FC = () => {
    const intl = useIntl();

    const [, dispatchAppState] = useAppState();

    const { hasToken, isAuthenticated, tokenAuthLoading, tokenVerifyLoading, user } = useAuth();

    const { channel } = useAppChannel(false);

    const channelLoaded = typeof channel !== "undefined";

    const homePageLoaded = channelLoaded && isAuthenticated && !tokenAuthLoading && !tokenVerifyLoading;

    const homePageLoading = (isAuthenticated && !channelLoaded) || (hasToken && tokenVerifyLoading);

    return (
        <>
            <WindowTitle title={intl.formatMessage(commonMessages.dashboard)} />

            {homePageLoaded ? (
                <AppLayout>
                    <ErrorBoundary
                        onError={(e) => {
                            const errorId = errorTracker.captureException(e);

                            dispatchAppState({
                                payload: {
                                    error: "unhandled",
                                    errorId,
                                },
                                type: "displayError",
                            });
                        }}
                    >
                        <Switch>
                            <SectionRoute exact path="/" component={HomePage} />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path="/categories"
                                component={CategorySection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_CHANNELS]}
                                path={channelsSection}
                                component={ChannelsSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path="/collections"
                                component={CollectionSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_APPS]}
                                path={appsSection}
                                component={AppsSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PLUGINS]}
                                path="/plugins"
                                component={PluginsSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_ORDERS]}
                                path="/orders"
                                component={OrdersSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path="/products"
                                component={ProductSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES]}
                                path="/product-types"
                                component={ProductTypesSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES]}
                                path={attributeSection}
                                component={AttributeSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                                path="/discounts"
                                component={DiscountSection}
                            />
                            {/* <SectionRoute
                                // add after backend adds the permission to schema
                                permissions={[]}
                                path={giftCardsSectionUrlName}
                                component={GiftCardSection}
                            /> */}
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                                path="/taxes"
                                component={TaxesSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_SHIPPING]}
                                path="/shipping"
                                component={ShippingSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PRODUCTS]}
                                path={warehouseSection}
                                component={WarehouseSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_USERS]}
                                path="/customers"
                                component={CustomerSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_STAFF]}
                                path="/staff"
                                component={StaffSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_STAFF]}
                                path="/permission-groups"
                                component={PermissionGroupSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_SETTINGS]}
                                path="/site-settings"
                                component={SiteSettingsSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_TRANSLATIONS]}
                                path="/translations"
                                component={TranslationsSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_MENUS]}
                                path={navigationSection}
                                component={NavigationSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PAGES]}
                                path="/pages"
                                component={PageSection}
                            />
                            <SectionRoute
                                permissions={[PermissionEnum.MANAGE_PAGES]}
                                path="/page-types"
                                component={PageTypesSection}
                            />

                            {createConfigurationMenu(intl).filter((menu) =>
                                menu.menuItems.map((item) => hasPermission(item.permission, user))
                            ).length > 0 && (
                                <SectionRoute
                                    exact
                                    path="/configuration"
                                    component={ConfigurationSection}
                                />
                            )}
                            <Route component={NotFound} />
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

render(<App />, document.querySelector("#dashboard-app"));
