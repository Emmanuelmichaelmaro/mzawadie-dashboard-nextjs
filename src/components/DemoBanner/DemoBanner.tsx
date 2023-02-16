import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { FormattedMessage } from "react-intl";

import { ExternalLink } from "../ExternalLink";
import { MZAWADIE_GRAPHQL_URL, MZAWADIE_STOREFRONT_URL } from "./constants";
import styles from "./styles";

export const DemoBanner: React.FC = () => {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const classes = styles();

    return (
        <div className={classes.wrapper}>
            <div className={classes.borderedWrapper}>
                <div />
                <div className={classes.linkList}>
                    <ExternalLink className={classes.link} href={MZAWADIE_STOREFRONT_URL}>
                        {isMdUp ? (
                            <FormattedMessage
                                defaultMessage="See <emphasis>DEMO STOREFRONT</emphasis>"
                                id="4gZl/n"
                                values={{
                                    emphasis: (children: any) => (
                                        <em className={classes.textEmphasis}>{children}</em>
                                    ),
                                }}
                            />
                        ) : (
                            <div className={classes.textEmphasis}>
                                <FormattedMessage defaultMessage="Storefront" id="LmKz3g" />
                            </div>
                        )}
                    </ExternalLink>

                    {isMdUp && <div className={classes.divider} />}

                    <ExternalLink className={classes.link} href={MZAWADIE_GRAPHQL_URL}>
                        {isMdUp ? (
                            <FormattedMessage
                                defaultMessage="Play with <emphasis>GraphQL API</emphasis>"
                                id="/X8Mjx"
                                values={{
                                    emphasis: (children: any) => (
                                        <em className={classes.textEmphasis}>{children}</em>
                                    ),
                                }}
                            />
                        ) : (
                            <div className={classes.textEmphasis}>
                                <FormattedMessage defaultMessage="API" id="xwEc8K" />
                            </div>
                        )}
                    </ExternalLink>
                </div>
            </div>
        </div>
    );
};

DemoBanner.displayName = "DemoBanner";

export default DemoBanner;
