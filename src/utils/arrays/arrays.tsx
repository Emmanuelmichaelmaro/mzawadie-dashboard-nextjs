// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import difference from "lodash/difference";
import intersection from "lodash/intersection";

// eslint-disable-next-line import/prefer-default-export
export const arrayDiff = (before: string[] | undefined, after: string[]) => ({
    added: difference(after, before),
    removed: difference(before, after),
    common: intersection(before, after),
});
