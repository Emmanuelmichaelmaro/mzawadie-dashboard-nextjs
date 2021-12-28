import { gql } from "@apollo/client";
import { NextPageContext } from "next";
import Router from "next/router";

import { initializeApollo } from "./apollo";

export const LoggedInUserDocument = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

/**
 * A function that queries for the logged in user before rendering the page.
 * Should be called in getInitialProps. It redirects as desired.
 *
 * It allows for redirecting both if the user is not logged in (e.g., redirect
 * to login page) or redirecting if the user is logged in.
 *
 * If not logged in, redirects to the desired route.
 *
 * The return value indicates whether logic should continue or not after the
 * call.
 */
const redirectBasedOnLogin = async (
    ctx: NextPageContext,
    route: string,
    redirectIfAuth: boolean
): Promise<boolean> => {
    // pass along the headers for authentication
    const apolloClient = initializeApollo();

    const isLoggedIn = await apolloClient
        .query({
            query: LoggedInUserDocument,
            // Prevent caching issues when logging in/out without refresh.
            fetchPolicy: "network-only",
        })
        .then(({ data }) => {
            if (!data || !data.isLoggedIn) {
                return false;
            }
            return Boolean(data.isLoggedIn);
        })
        .catch((error) => {
            // Fail gracefully
            console.log(error);
            return false;
        });

    // console.log(isLoggedIn);

    // const isLoggedIn = false;

    const shouldRedirect = redirectIfAuth ? isLoggedIn : !isLoggedIn;

    if (shouldRedirect) {
        // https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
        if (ctx.res) {
            ctx.res.writeHead(302, {
                Location: route,
            });
            ctx.res.end();
        } else {
            await Router.push(route);
        }

        return Promise.resolve(false);
    }

    return Promise.resolve(true);
};

export default redirectBasedOnLogin;
