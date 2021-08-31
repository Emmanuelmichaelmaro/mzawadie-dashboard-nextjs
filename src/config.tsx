import packageInfo from "../package.json"

export const APP_VERSION = packageInfo.version

export const DEMO_MODE = process.env.DEMO_MODE === "true"
export const GTM_ID = process.env.GTM_ID

export const DEFAULT_NOTIFICATION_SHOW_TIME = 3000
