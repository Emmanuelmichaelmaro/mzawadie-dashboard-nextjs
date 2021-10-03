import { NextPageContext } from "next";
export declare const LoggedInUserDocument: import("@apollo/client").DocumentNode;
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
declare const redirectBasedOnLogin: (ctx: NextPageContext, route: string, redirectIfAuth: boolean) => Promise<boolean>;
export default redirectBasedOnLogin;
