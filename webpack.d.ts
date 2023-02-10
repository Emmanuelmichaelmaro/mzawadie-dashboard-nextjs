declare module "*.jpg";
declare module "*.png";
declare module "*.svg" {
    const content: any;
    export default content;
}

declare interface Window {
    // @ts-ignore
    PasswordCredential: PasswordCredential;
}
