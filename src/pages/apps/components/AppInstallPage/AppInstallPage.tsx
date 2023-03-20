// @ts-nocheck
import saleorDarkLogoSmall from "@assets/images/logo-dark-small.svg";
import plusIcon from "@assets/images/plus-icon.svg";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Container from "@mzawadie/components/Container";
import Hr from "@mzawadie/components/Hr";
import Skeleton from "@mzawadie/components/Skeleton";
import { buttonMessages } from "@mzawadie/core";
import { AppFetchMutation, AppInstallMutation } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { Button } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";

export interface AppInstallPageProps {
    data: AppFetchMutation["appFetchManifest"]["manifest"];
    loading: boolean;
    navigateToAppsList: () => void;
    onSubmit: () => SubmitPromise<AppInstallMutation["appInstall"]["errors"]>;
}

export const AppInstallPage: React.FC<AppInstallPageProps> = ({
    data,
    loading,
    navigateToAppsList,
    onSubmit,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    const name = data?.name || "";

    return (
        <Container>
            <CardSpacer />
            <Card>
                <CardTitle
                    title={
                        loading ? (
                            <Skeleton />
                        ) : (
                            intl.formatMessage(
                                {
                                    defaultMessage: "You are about to install {name}",
                                    id: "Id7C0X",
                                    description: "section header",
                                },
                                { name }
                            )
                        )
                    }
                />

                <CardContent className={classes.installCard}>
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <div className={classes.installAppContainer}>
                            <div className={classNames(classes.installIcon, classes.installSaleorIcon)}>
                                <img src={saleorDarkLogoSmall} alt="" />
                            </div>
                            <img src={plusIcon} alt="" />
                            <div className={classes.installIcon}>
                                <h2>{name?.charAt(0).toUpperCase()}</h2>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <CardSpacer />

            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "App permissions",
                        id: "VsGcdP",
                        description: "section header",
                    })}
                />

                <CardContent>
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <>
                            <Typography className={classes.installPermissionTitle}>
                                <FormattedMessage
                                    defaultMessage="Installing this app will give it following permissions:"
                                    id="BL/Lbk"
                                    description="install app permissions"
                                />
                            </Typography>

                            {!!data?.permissions?.length && (
                                <ul className={classes.permissionsContainer}>
                                    {data?.permissions?.map((perm) => (
                                        <li key={perm.code}>{perm.name}</li>
                                    ))}
                                </ul>
                            )}

                            <Hr className={classes.installSpacer} />

                            <Typography variant="body2" className={classes.installPrivacyText}>
                                <FormattedMessage
                                    defaultMessage="Uninstalling the app will remove all your customer’s personal data stored by {name}. "
                                    id="t1UYU6"
                                    description="install app privacy"
                                    values={{ name }}
                                />
                                <a
                                    href={data?.dataPrivacyUrl}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <FormattedMessage
                                        defaultMessage="Learn more about data privacy"
                                        id="k5lHFp"
                                        description="app data privacy link"
                                    />
                                </a>
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>

            <CardSpacer />

            <Grid container justify="space-between">
                <Grid xs={6} item>
                    <Button variant="secondary" onClick={navigateToAppsList}>
                        <FormattedMessage {...buttonMessages.cancel} />
                    </Button>
                </Grid>

                <Grid xs={6} item className={classes.alignRight}>
                    <Button variant="primary" onClick={onSubmit}>
                        <FormattedMessage
                            defaultMessage="Install App"
                            id="PkCmGU"
                            description="install button"
                        />
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

AppInstallPage.displayName = "AppInstallPage";

export default AppInstallPage;
