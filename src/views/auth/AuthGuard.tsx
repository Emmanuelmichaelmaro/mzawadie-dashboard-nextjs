import useAppChannel from "@mzawadie/components/AppLayout/AppChannelContext";
import { useAuth } from "@mzawadie/sdk/lib/src";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: any }): any {
    const router = useRouter();

    const [authorized, setAuthorized] = useState(false);

    const { authenticated } = useAuth();

    const { channel } = useAppChannel(false);

    const channelLoaded = typeof channel !== "undefined";

    useEffect(() => {
        // on initial load - run auth check
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false
        const hideContent = () => setAuthorized(false);
        router.events.on("routeChangeStart", hideContent);

        // on route change complete - run auth check
        router.events.on("routeChangeComplete", authCheck);

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off("routeChangeStart", hideContent);
            router.events.off("routeChangeComplete", authCheck);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function authCheck(url: string) {
        // redirect to login page if accessing a private page and not logged in
        const publicPaths = ["/login"];

        const path = url.split("?")[0];

        if (!authenticated && !channelLoaded && !publicPaths.includes(path)) {
            setAuthorized(false);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.push({
                pathname: "/login",
                query: { returnUrl: router.asPath },
            });
        } else {
            setAuthorized(true);
        }
    }

    return authorized && children;
}

// import NotFound from "@mzawadie/NotFound";
// import AppLayout from "@mzawadie/components/AppLayout";
// import { PermissionEnum } from "@mzawadie/types/globalTypes";
// import { useAuth } from "@mzawadie/views/auth/AuthProvider";
// import { LoginLoading } from "@mzawadie/views/auth/components";
// import { hasPermission } from "@mzawadie/views/auth/misc";
//
// export function AuthGuard({
//     children,
//     permissions,
// }: {
//     children: React.ReactNode;
//     permissions?: PermissionEnum[];
// }) {
//     const { initializing, isAuthenticated, setRedirect, user } = useAuth();
//     const router = useRouter();
//
//     useEffect(() => {
//         if (!initializing) {
//             // auth is initialized and there is no user
//             if (!isAuthenticated) {
//                 // remember the page that user tried to access
//                 if (setRedirect) {
//                     setRedirect(router.route);
//                 }
//                 // redirect
//                 // eslint-disable-next-line @typescript-eslint/no-floating-promises
//                 router.push("/auth/login");
//             }
//         }
//     }, [initializing, router, isAuthenticated, setRedirect]);
//
//     /* show loading indicator while the auth provider is still initializing */
//     if (initializing || !isAuthenticated) {
//         return <LoginLoading />;
//     }
//
//     // if auth initialized with a valid user show protected page
//     if (!initializing && user) {
//         const hasPermissions =
//             !permissions ||
//             permissions
//                 .map((permission) => hasPermission(permission, user))
//                 .reduce((prev, curr) => prev && curr);
//
//         return hasPermissions ? <AppLayout>{children}</AppLayout> : <NotFound />;
//     }
//
//     /* otherwise don't return anything, will do a redirect from useEffect */
//     return null;
// }
