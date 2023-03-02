// @ts-nocheck
import activateIcon from "@assets/images/activate-icon.svg";
import settingsIcon from "@assets/images/settings-icon.svg";
import supportIcon from "@assets/images/support-icon.svg";
import { ButtonBase, Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@mzawadie/components/CardSpacer";
import { CardTitle } from "@mzawadie/components/CardTitle";
import Container from "@mzawadie/components/Container";
import { ExternalLink } from "@mzawadie/components/ExternalLink";
import { PageHeader } from "@mzawadie/components/PageHeader";
import Skeleton from "@mzawadie/components/Skeleton";
import { sectionNames } from "@mzawadie/core";
import { Backlink, Button } from "@saleor/macaw-ui";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";

import { useStyles } from "../../styles";
import { App_app } from "../../types/App";
import { DeactivatedText } from "../DeactivatedText";

export interface AppDetailsPageProps {
    loading: boolean;
    data: App_app;
    navigateToApp: () => void;
    navigateToAppSettings: () => void;
    onAppActivateOpen: () => void;
    onAppDeactivateOpen: () => void;
    onBack: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
    data,
    loading,
    navigateToApp,
    navigateToAppSettings,
    onAppActivateOpen,
    onAppDeactivateOpen,
    onBack,
}) => {
    const intl = useIntl();
    const classes = useStyles({});

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.apps)}</Backlink>

            <PageHeader
                title={
                    <>
                        {data?.name} {!data?.isActive && <DeactivatedText />}
                    </>
                }
            >
                <Button onClick={navigateToApp} variant="primary" data-tc="open-app">
                    <FormattedMessage defaultMessage="Open App" id="HtfL5/" description="button" />
                </Button>
            </PageHeader>

            <div className={classes.appHeader}>
                {data ? (
                    <div className={classes.appHeaderLinks}>
                        <ExternalLink
                            className={classes.headerLinkContainer}
                            href={data.supportUrl}
                            target="_blank"
                        >
                            <SVG src={supportIcon} />
                            <FormattedMessage
                                defaultMessage="Get Support"
                                id="Gjb6eq"
                                description="link"
                            />
                        </ExternalLink>

                        {data.configurationUrl && (
                            <ButtonBase
                                className={classes.headerLinkContainer}
                                disableRipple
                                onClick={navigateToAppSettings}
                            >
                                <SVG src={settingsIcon} />
                                <FormattedMessage
                                    defaultMessage="Edit settings"
                                    id="89PSdB"
                                    description="link"
                                />
                            </ButtonBase>
                        )}

                        <ButtonBase
                            className={classes.headerLinkContainer}
                            disableRipple
                            onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
                        >
                            <SVG src={activateIcon} />

                            {data?.isActive ? (
                                <FormattedMessage
                                    defaultMessage="Deactivate"
                                    id="whTEcF"
                                    description="link"
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="Activate"
                                    id="P5twxk"
                                    description="link"
                                />
                            )}
                        </ButtonBase>
                    </div>
                ) : (
                    <Skeleton />
                )}
                <div className={classes.hr} />
            </div>

            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "About this app",
                        id: "jDIRQV",
                        description: "section header",
                    })}
                />
                <CardContent>
                    {!loading ? <ReactMarkdown source={data?.aboutApp} /> : <Skeleton />}
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
                    {!loading ? (
                        <>
                            <Typography>
                                <FormattedMessage
                                    defaultMessage="This app has permissions to:"
                                    id="7oQUMG"
                                    description="apps about permissions"
                                />
                            </Typography>

                            {!!data?.permissions?.length && (
                                <ul className={classes.permissionsContainer}>
                                    {data?.permissions?.map((perm) => (
                                        <li key={perm.code}>{perm.name}</li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <Skeleton />
                    )}
                </CardContent>
            </Card>

            <CardSpacer />

            <Card>
                <CardTitle
                    title={intl.formatMessage({
                        defaultMessage: "Data privacy",
                        id: "a55zOn",
                        description: "section header",
                    })}
                />

                <CardContent>
                    {!loading ? (
                        <>
                            <Typography>{data?.dataPrivacy}</Typography>
                            <ExternalLink
                                className={classes.linkContainer}
                                href={data?.dataPrivacyUrl}
                                target="_blank"
                            >
                                <FormattedMessage
                                    defaultMessage="View this app’s privacy policy"
                                    id="Go50v2"
                                    description="app privacy policy link"
                                />
                            </ExternalLink>
                        </>
                    ) : (
                        <Skeleton />
                    )}
                </CardContent>
            </Card>
            <CardSpacer />
        </Container>
    );
};

AppDetailsPage.displayName = "AppDetailsPage";

export default AppDetailsPage;
