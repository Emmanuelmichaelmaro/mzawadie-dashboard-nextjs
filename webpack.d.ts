declare module "*.jpg";
declare module "*.png";
declare module "*.svg" {
    const content: any;
    export default content;
}

declare interface Window {
    // @ts-ignore
    PasswordCredential: PasswordCredential;
    __MZAWADIE_CONFIG__: {
        API_URL: string;
        APP_MOUNT_URI: string;
        MARKETPLACE_URL: string;
        MZAWADIE_APPS_PAGE_PATH: string;
        MZAWADIE_APPS_JSON_PATH: string;
        APP_TEMPLATE_GALLERY_PATH: string;
        APPS_MARKETPLACE_API_URI?: string;
        APPS_TUNNEL_URL_KEYWORDS?: string;
    };
}
