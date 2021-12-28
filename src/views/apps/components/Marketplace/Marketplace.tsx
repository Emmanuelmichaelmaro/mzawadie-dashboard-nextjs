import { Button, Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";

interface MarketplaceProps {
    link?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ link }) => {
    const intl = useIntl();
    const classes = useStyles({});

    return (
        <div className={classes.appContainer}>
            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Mzawadie Marketplace",
                        id: "hoV07D",
                        description: "section header",
                    })}
                />

                <CardContent className={classes.marketplaceContent}>
                    {link ? (
                        <>
                            <Typography variant="body2">
                                <FormattedMessage
                                    defaultMessage="Discover great free and paid apps in our Mzawadie Marketplace."
                                    id="RW75je"
                                    description="marketplace content"
                                />
                            </Typography>

                            <Button color="primary" onClick={link}>
                                <FormattedMessage
                                    defaultMessage="Visit Marketplace"
                                    id="wxFwUW"
                                    description="marketplace button"
                                />
                            </Button>
                        </>
                    ) : (
                        <Typography variant="body2">
                            <FormattedMessage
                                defaultMessage="Marketplace is coming soon"
                                id="NskBjH"
                                description="marketplace content"
                            />
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

Marketplace.displayName = "Marketplace";

export default Marketplace;
