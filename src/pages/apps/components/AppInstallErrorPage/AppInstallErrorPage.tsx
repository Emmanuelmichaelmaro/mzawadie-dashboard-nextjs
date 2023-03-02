// @ts-nocheck
import errorImg from "@assets/images/app-install-error.svg";
import { Grid, Typography } from "@material-ui/core";
import Container from "@mzawadie/components/Container";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

interface AppInstallErrorPageProps {
    onBack: () => void;
}

export const AppInstallErrorPage: React.FC<AppInstallErrorPageProps> = ({ onBack }) => {
    const classes = useStyles({});

    return (
        <Container className={classes.root}>
            <Grid spacing={3} alignItems="center" container>
                <Grid xs={12} sm={6} item>
                    <img src={errorImg} alt="" />
                </Grid>

                <Grid xs={12} sm={6} item>
                    <Typography variant="h3" component="h3">
                        <FormattedMessage
                            defaultMessage="There’s a problem with app."
                            id="WnlZMO"
                            description="title"
                        />
                    </Typography>

                    <Typography variant="body2">
                        <FormattedMessage
                            defaultMessage="Mzawadie couldn't fetch crucial information regarding installation. Without those System can’t install the app in your Saleor. Please use the button below to get back to system’s dashboard."
                            id="uak0ii"
                            description="content"
                        />
                    </Typography>

                    <Button className={classes.button} variant="primary" onClick={onBack}>
                        <FormattedMessage
                            defaultMessage="Back to homepage"
                            id="906uUr"
                            description="button"
                        />
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AppInstallErrorPage;
