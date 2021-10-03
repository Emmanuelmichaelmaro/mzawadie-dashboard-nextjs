import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { ErrorPageProps } from "@mzawadie/pages/_error";
import { NextPage } from "next";
import Head from "next/head";
import React from "react";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: 540,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },
    mt: {
        marginTop: 10,
    },
});

const Custom404Page: NextPage<ErrorPageProps> = ({ statusCode }) => {
    const classes = useStyles();

    return (
        <>
            <Head>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <title>The page you were looking for doesn't exist | {statusCode}</title>
            </Head>

            <Box className={classes.root}>
                <img src="/favicons/custom-404.jpeg" width="320" height="320" alt="page not found" />
                <Typography className={classes.mt}>This page does not exist</Typography>
                <Typography className={classes.mt}>
                    <a href="/">Return to Home Page</a>
                </Typography>
            </Box>
        </>
    );
};

export default Custom404Page;
