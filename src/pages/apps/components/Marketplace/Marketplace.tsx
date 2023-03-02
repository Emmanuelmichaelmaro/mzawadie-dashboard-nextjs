import { Card, CardContent, Typography } from "@material-ui/core";
import { CardTitle } from "@mzawadie/components/CardTitle";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface MarketplaceProps {
    link?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ link }) => {
    const intl = useIntl();

    return (
        <div>
            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Mzawadie Marketplace",
                        id: "hoV07D",
                        description: "section header",
                    })}
                />
                <CardContent>
                    {!!link ? (
                        <>
                            <Typography variant="body2">
                                <FormattedMessage
                                    defaultMessage="Discover great free and paid apps in our Saleor Marketplace."
                                    id="LATpSE"
                                    description="marketplace content"
                                />
                            </Typography>

                            <Button onClick={link}>
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
