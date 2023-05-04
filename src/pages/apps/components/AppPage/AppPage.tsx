// @ts-nocheck
import { Typography } from "@material-ui/core";
import { Backlink } from "@mzawadie/components/Backlink";
import { Button } from "@mzawadie/components/Button";
import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import Hr from "@mzawadie/components/Hr";
import { sectionNames } from "@mzawadie/core";
import { AppQuery } from "@mzawadie/graphql";
import { appsListPath } from "@mzawadie/pages/apps/urls";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AppFrame } from "../AppFrame";
import { useStyles } from "./styles";
import useSettingsBreadcrumbs from "./useSettingsBreadcrumbs";

export interface AppPageProps {
    data: AppQuery["app"];
    url: string;
    onError: () => void;
    aboutHref: string;
    refetch?: () => void;
}

export const AppPage: React.FC<AppPageProps> = ({ data, url, aboutHref, onError, refetch }) => {
    const intl = useIntl();
    const classes = useStyles({});
    const [breadcrumbs, onBreadcrumbClick] = useSettingsBreadcrumbs();

    return (
        <Container>
            <Backlink href={appsListPath}>{intl.formatMessage(sectionNames.apps)}</Backlink>

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
                    <Button href={aboutHref} variant="primary">
                        <FormattedMessage id="UCHtG6" defaultMessage="About" description="button" />
                    </Button>
                </div>
            </Grid>

            <CardSpacer />

            <Hr />

            <CardSpacer />

            <div className={classes.iframeContainer}>
                {url && (
                    <AppFrame
                        src={url}
                        appToken={data?.accessToken}
                        onError={onError}
                        appId={data?.id}
                        refetch={refetch}
                    />
                )}
            </div>
        </Container>
    );
};

AppPage.displayName = "AppPage";

export default AppPage;
