import { getAppDefaultUri, getAppMountUri } from "@mzawadie/core";
import isArray from "lodash/isArray";
import { stringify } from "qs";

export function stringifyQs(parameters: {}): string {
    return stringify(parameters, {
        indices: false,
        arrayFormat: "brackets",
    });
}

export function getArrayQueryParam(parameter: string | string[]): string[] {
    if (!parameter) {
        return [];
    }

    if (isArray(parameter)) {
        return parameter;
    }

    return [parameter];
}

export const isExternalURL = (url: any) => /^https?:\/\//.test(url);

export const getAppMountUriForRedirect = () =>
    getAppMountUri() === getAppDefaultUri() ? "" : getAppMountUri();
