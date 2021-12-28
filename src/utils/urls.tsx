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
