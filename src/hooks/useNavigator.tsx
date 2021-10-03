// import useRouter from "use-react-router"
import Router, { useRouter } from "next/router";

export type UseNavigatorResult = (url: string, replace?: boolean, preserveQs?: boolean) => void;

function useNavigator(): UseNavigatorResult {
    // const {
    //     location: { search },
    //     history,
    // } = useRouter()

    const { query } = useRouter();

    return async (url: string, replace = false, preserveQs = false) => {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const targetUrl = preserveQs ? url + query : url;

        if (replace) {
            await Router.replace(targetUrl);
        } else {
            await Router.push(targetUrl);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        typeof window !== "undefined" ? window.scrollTo({ behavior: "smooth", top: 0 }) : undefined;
    };
}

export default useNavigator;

// import { useApolloClient, useQuery } from "@apollo/react-hooks";
// import { useRouter } from "next/router";
// import { useEffect, useRef } from "react";
// import { SETTINGS } from "../graphql/queries";

// function parseQuery(queryString) {
//   var query = {};
//   var pairs = (queryString[0] === "?"
//     ? queryString.substr(1)
//     : queryString
//   ).split("&");
//   for (var i = 0; i < pairs.length; i++) {
//     var pair = pairs[i].split("=");
//     if (pair[0] === "") continue;
//     query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
//   }
//   return query;
// }

// /**
//  * A hook that syncs changes from local state to the URL
//  * to provide persistence. Syncs only changes defined in the
//  * SETTINGS query and doesn't mess with others.
//  */
// export const useURLSync = () => {
//   const router = useRouter();
//   const { data } = useQuery(SETTINGS);
//   const firstLoad = useRef(true);
//   const client = useApolloClient();

//   useEffect(() => {
//     if (!(process as any).browser) return;

//     const query = parseQuery(window.location.search.slice(1));

//     if (firstLoad.current) {
//       // First load, so sync one way
//       client.writeQuery({
//         query: SETTINGS,
//         data: {
//           ...query,
//         },
//       });
//       firstLoad.current = false;
//       return;
//     }

//     const updateQuery = (newQuery) => {
//       router.push(
//         {
//           pathname: router.pathname,
//           query: { ...newQuery },
//         },
//         {
//           pathname: `/places/${router.query.zone}`,
//           query: { ...newQuery },
//         },
//         {
//           shallow: true,
//         }
//       );
//     };

//     if (Object.entries(data).every(([k, v]) => query[k] === v)) {
//       return;
//     }

//     const newQuery = Object.assign(query, data);
//     updateQuery(newQuery);
//   }, [client, data, router, router.query]);
// };
