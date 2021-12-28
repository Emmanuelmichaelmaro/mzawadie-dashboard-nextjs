import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import Container from "@mzawadie/components/Container";
import PageHeader from "@mzawadie/components/PageHeader";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface HomeScreenProps {
    user: {
        email: string;
    };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
    const intl = useIntl();

    return (
        <Container>
            <PageHeader
                title={intl.formatMessage(
                    {
                        defaultMessage: "Hello there, {userName}",
                        description: "header",
                        id: "By5ZBp",
                    },
                    { userName: user.email }
                )}
            />
            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Disclaimer",
                        description: "header",
                        id: "6L6Fy2",
                    })}
                />
                <CardContent>
                    <Typography>
                        <FormattedMessage
                            defaultMessage="The new dashboard and the GraphQL API are preview-quality software."
                            id="5LRkEs"
                        />
                    </Typography>
                    <Typography>
                        <FormattedMessage
                            defaultMessage="The GraphQL API is beta quality. It is not fully optimized and some mutations or queries may be missing."
                            id="G7mu0y"
                        />
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};
