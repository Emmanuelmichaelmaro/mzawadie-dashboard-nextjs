/* eslint-disable @typescript-eslint/ban-types,consistent-return */
import redirectBasedOnLogin from "@mzawadie/auth/lib/redirectBasedOnLogin";
import { NextComponentType, NextPageContext } from "next";
import React from "react";

/**
 * General HOC that allows redirection based on authentication. We should not
 * expose this: instead export specific routes and redirect combinations.
 */
const withAuthRedirect =
    (route: string, redirectIfAuth: boolean) =>
    <P,>(Page: NextComponentType<NextPageContext, {}, P>) => {
        return class extends React.Component<P> {
            static async getInitialProps(ctx: NextPageContext) {
                const shouldContinue = await redirectBasedOnLogin(ctx, route, redirectIfAuth);

                // Only continue if we're logged in. Otherwise, it might cause an
                // unnecessary call to a downstream getInitialProps that requires
                // authentication.
                if (!shouldContinue) {
                    return {};
                }

                if (Page.getInitialProps) {
                    return Page.getInitialProps(ctx);
                }
            }

            render() {
                return <Page {...this.props} />;
            }
        };
    };

/**
 * HOC that redirects to login page if the user is not logged in.
 */
export const withLoginRedirect = withAuthRedirect("/auth/login", false);

/**
 * HOC that redirects to the dashboard if the user is logged in.
 */
export const withDashboardRedirect = withAuthRedirect("/dashboard", true);
