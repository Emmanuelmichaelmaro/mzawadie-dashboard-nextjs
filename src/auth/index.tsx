/* eslint-disable import/prefer-default-export */
import AuthProvider, { useAuth, UserContext } from "./AuthProvider";
import { isJwtError, JWTError, isTokenExpired } from "./errors";
import { useApollo, addApolloState, initializeApollo, createApolloClient } from "./lib/apollo";
import { redirect } from "./lib/redirect";
import WithApollo from "./lib/withApollo";
import { withDashboardRedirect, withLoginRedirect } from "./lib/withAuth";
import {
    getTokens,
    removeTokens,
    setTokens,
    setAuthToken,
    handleQueryAuthError,
    displayDemoMessage,
} from "./utils";

export {
    AuthProvider,
    useAuth,
    UserContext,
    initializeApollo,
    createApolloClient,
    addApolloState,
    useApollo,
    WithApollo,
    withDashboardRedirect,
    withLoginRedirect,
    redirect as Redirect,
    isJwtError,
    JWTError,
    isTokenExpired,
    getTokens,
    removeTokens,
    setTokens,
    setAuthToken,
    handleQueryAuthError,
    displayDemoMessage,
};
