import { NextPage } from "next";
export interface ErrorPageProps {
    statusCode: number;
}
declare const ErrorPage: NextPage<ErrorPageProps>;
export default ErrorPage;
