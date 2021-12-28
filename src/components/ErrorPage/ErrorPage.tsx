// @ts-nocheck
import notFoundImage from "@assets/images/what.svg";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

export interface ErrorPageProperties {
    id?: string | null;
    onBack: () => void;
}

const useStyles = makeStyles(
    (theme) => ({
        bottomHeader: {
            fontWeight: 600 as const,
            textTransform: "uppercase",
        },
        button: {
            marginTop: theme.spacing(2),
            padding: 20,
        },
        container: {
            [theme.breakpoints.down("sm")]: {
                gridTemplateColumns: "1fr",
                padding: theme.spacing(3),
                width: "100%",
            },
            display: "grid",
            gridTemplateColumns: "1fr 487px",
            margin: "0 auto",
            width: 830,
        },
        errorId: {
            marginTop: theme.spacing(3),
        },
        innerContainer: {
            [theme.breakpoints.down("sm")]: {
                order: 1,
                textAlign: "center",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        },
        notFoundImage: {
            "& svg": {
                width: "100%",
            },
        },
        root: {
            alignItems: "center",
            display: "flex",
            height: "calc(100vh - 180px)",
        },
        upperHeader: {
            fontWeight: 600 as const,
        },
    }),
    { name: "ErrorPage" }
);

const ErrorPage: React.FC<ErrorPageProperties> = (properties) => {
    const { onBack, id } = properties;

    const classes = useStyles(properties);

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.innerContainer}>
                    <div>
                        <Typography className={classes.upperHeader} variant="h4">
                            <FormattedMessage defaultMessage="Ooops!..." id="yH56V+" />
                        </Typography>
                        <Typography className={classes.bottomHeader} variant="h3">
                            <FormattedMessage defaultMessage="Error" id="KN7zKn" />
                        </Typography>
                        <Typography>
                            <FormattedMessage
                                defaultMessage="We've encountered a problem..."
                                id="QnOvJw"
                            />
                        </Typography>
                        <Typography>
                            <FormattedMessage
                                defaultMessage="Don't worry, everything is gonna be fine"
                                id="c1b4T+"
                            />
                        </Typography>
                        {!!id && (
                            <Typography variant="subtitle2" className={classes.errorId}>
                                Error ID: {id}
                            </Typography>
                        )}
                    </div>
                    <div>
                        <Button
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            onClick={onBack}
                        >
                            <FormattedMessage
                                defaultMessage="Back to home"
                                id="vjkcAv"
                                description="button"
                            />
                        </Button>
                    </div>
                </div>
                <div>
                    <SVG className={classes.notFoundImage} src={notFoundImage} />
                </div>
            </div>
        </div>
    );
};

ErrorPage.displayName = "ErrorPage";

export default ErrorPage;
