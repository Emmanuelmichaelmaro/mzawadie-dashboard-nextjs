import { Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import Hr from "@mzawadie/components/Hr";
import { sectionNames } from "@mzawadie/core";
import { Backlink, Button } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { App_app } from "../../types/App";
import { AppFrame } from "../AppFrame";
import { useStyles } from "./styles";
import useSettingsBreadcrumbs from "./useSettingsBreadcrumbs";

export interface AppPageProps {
    data: App_app;
    url: string;
    navigateToAbout: () => void;
    onBack: () => void;
    onError: () => void;
}

export const AppPage: React.FC<AppPageProps> = ({ data, url, navigateToAbout, onBack, onError }) => {
    const intl = useIntl();
    const classes = useStyles({});
    const [breadcrumbs, onBreadcrumbClick] = useSettingsBreadcrumbs();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.apps)}</Backlink>

            <Grid variant="uniform">
                <div className={classes.breadcrumbContainer}>
                    <div className={classes.breadcrumbs}>
                        <Typography
                            className={classNames(classes.breadcrumb, classes.breadcrumbDisabled)}
                            variant="h5"
                        >
                            {data?.name}
                        </Typography>

                        {breadcrumbs.map((b) => (
                            <Typography
                                className={classes.breadcrumb}
                                variant="h5"
                                onClick={() => onBreadcrumbClick(b.value)}
                                key={b.label}
                            >
                                {b.label}
                            </Typography>
                        ))}
                    </div>
                </div>

                <div className={classes.appSettingsHeader}>
                    <Button onClick={navigateToAbout} variant="primary">
                        <FormattedMessage defaultMessage="About" id="UCHtG6" description="button" />
                    </Button>

                    <Button
                        component="a"
                        href={data?.homepageUrl}
                        variant="primary"
                        data-tc="open-app"
                        target="_blank"
                    >
                        <FormattedMessage
                            defaultMessage="App home page"
                            id="llC1q8"
                            description="button"
                        />
                    </Button>

                    <Button
                        component="a"
                        href={data?.supportUrl}
                        variant="primary"
                        data-tc="open-support"
                        target="_blank"
                    >
                        <FormattedMessage
                            defaultMessage="Support/FAQ"
                            id="hdcGSJ"
                            description="button"
                        />
                    </Button>
                </div>
            </Grid>

            <CardSpacer />

            <Hr />

            <CardSpacer />

            <div className={classes.iframeContainer}>
                {url && <AppFrame src={url} appToken={data.accessToken} onError={onError} />}
            </div>

            <CardSpacer />
        </Container>
    );
};

AppPage.displayName = "AppPage";

export default AppPage;
