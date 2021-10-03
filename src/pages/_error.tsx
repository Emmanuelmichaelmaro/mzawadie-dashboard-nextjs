/* eslint-disable @typescript-eslint/ban-ts-comment */
import Custom404Page from "@mzawadie/pages/404";
import { NextPage } from "next";
import React from "react";

export interface ErrorPageProps {
    statusCode: number;
}

// @ts-ignore
const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
    return (
        <div>
            {statusCode ? <Custom404Page statusCode={statusCode} /> : "An error occurred on client"}
        </div>
    );
};

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/require-await
ErrorPage.getInitialProps = async ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

    return { statusCode };
};

export default ErrorPage;
