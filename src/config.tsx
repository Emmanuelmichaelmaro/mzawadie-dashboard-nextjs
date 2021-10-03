/* eslint-disable import/prefer-default-export */
import packageInfo from "../package.json";

export const APP_MOUNT_URI = process.env.NEXT_PUBLIC_APP_MOUNT_URI || "http://localhost:9000/dashboard/";
export const APP_DEFAULT_URI = "/";
export const API_URI = process.env.NEXT_PUBLIC_API_URI || "http://localhost:8000/graphql/";
export const APP_VERSION = packageInfo.version;

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;
