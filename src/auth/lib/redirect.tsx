import { NextPageContext } from "next";
import Router from "next/router";

/**
 * Redirect function
 *
 * @param context Next.js context, need to perform redirect on server-side
 * @param target Address
 */
export const redirect = async (target: string, context?: NextPageContext) => {
    if (context?.res) {
        // server
        // 303: "See other"
        context?.res.writeHead(303, { Location: target });
        context?.res.end();
    } else {
        // In the browser, we just pretend like this never even happened ;)
        await Router.replace(target);
    }
};

export default redirect;
