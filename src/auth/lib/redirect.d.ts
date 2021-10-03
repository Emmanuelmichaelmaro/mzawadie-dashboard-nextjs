import { NextPageContext } from "next";
/**
 * Redirect function
 *
 * @param context Next.js context, need to perform redirect on server-side
 * @param target Address
 */
export declare const redirect: (target: string, context?: NextPageContext | undefined) => Promise<void>;
export default redirect;
