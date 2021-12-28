// @ts-nocheck
function warning(cond: any, message: string): void {
    if (!cond) {
        // eslint-disable-next-line no-console
        if (typeof console !== "undefined") console.warn(message);

        try {
            // Welcome to debugging React Router!
            //
            // This error is thrown as a convenience so you can more easily
            // find the source for a warning that appears in the console by
            // enabling "pause on exceptions" in your JavaScript debugger.
            throw new Error(message);
            // eslint-disable-next-line no-empty
        } catch (e) {}
    }
}

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};

/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */
export interface PathPattern {
    /**
     * A string to match against a URL pathname. May contain `:id`-style segments
     * to indicate placeholders for dynamic parameters. May also end with `/*` to
     * indicate matching the rest of the URL pathname.
     */
    path: string;
    /**
     * Should be `true` if the static portions of the `path` should be matched in
     * the same case.
     */
    caseSensitive?: boolean;
    /**
     * Should be `true` if this pattern should match the entire URL pathname.
     */
    end?: boolean;
}

/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ParamKey extends string = string> {
    /**
     * The names and values of dynamic parameters in the URL.
     */
    params: Params<ParamKey>;
    /**
     * The portion of the URL pathname that was matched.
     */
    pathname: string;
    /**
     * The portion of the URL pathname that was matched before child routes.
     */
    pathnameBase: string;
    /**
     * The pattern that was used to match.
     */
    pattern: PathPattern;
}

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchpath
 */
export function matchPath<ParamKey extends string = string>(
    pattern: PathPattern | string,
    pathname: string
): PathMatch<ParamKey> | null {
    if (typeof pattern === "string") {
        pattern = { path: pattern, caseSensitive: false, end: true };
    }

    const [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);

    const match = pathname.path.match(matcher);

    if (!match) return null;

    const matchedPathname = match[0];
    let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
    const captureGroups = match.slice(1);
    const params: Params = paramNames.reduce<Mutable<Params>>((memo, paramName, index) => {
        // We need to compute the pathnameBase here using the raw splat value
        // instead of using params["*"] later because it will be decoded then
        if (paramName === "*") {
            const splatValue = captureGroups[index] || "";
            pathnameBase = matchedPathname
                .slice(0, matchedPathname.length - splatValue.length)
                .replace(/(.)\/+$/, "$1");
        }

        memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName);
        return memo;
    }, {});

    return {
        params,
        pathname: matchedPathname,
        pathnameBase,
        pattern,
    };
}

const compilePath = (path: string, caseSensitive = false, end = true): [RegExp, string[]] => {
    warning(
        path === "*" || !path.endsWith("*") || path.endsWith("/*"),
        `Route path "${path}" will be treated as if it were ` +
            `"${path.replace(/\*$/, "/*")}" because the \`*\` character must ` +
            `always follow a \`/\` in the pattern. To get rid of this warning, ` +
            `please change the route path to "${path.replace(/\*$/, "/*")}".`
    );

    const paramNames: string[] = [];
    let regexpSource = `^${path
        .replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
        .replace(/^\/*/, "/") // Make sure it has a leading /
        .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
        .replace(/:(\w+)/g, (_: string, paramName: string) => {
            paramNames.push(paramName);
            return "([^\\/]+)";
        })}`;

    if (path.endsWith("*")) {
        paramNames.push("*");
        regexpSource +=
            path === "*" || path === "/*"
                ? "(.*)$" // Already matched the initial /, just match the rest
                : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
    } else {
        regexpSource += end
            ? "\\/*$" // When matching to the end, ignore trailing slashes
            : // Otherwise, at least match a word boundary. This restricts parent
              // routes to matching only their own words and nothing more, e.g. parent
              // route "/home" should not match "/home2".
              "(?:\\b|$)";
    }

    const matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");

    return [matcher, paramNames];
};

const safelyDecodeURIComponent = (value: string, paramName: string) => {
    try {
        return decodeURIComponent(value);
    } catch (error) {
        warning(
            false,
            `The value for the URL param "${paramName}" will not be decoded because` +
                ` the string "${value}" is a malformed URL segment. This is probably` +
                ` due to a bad percent encoding (${error}).`
        );

        return value;
    }
};
