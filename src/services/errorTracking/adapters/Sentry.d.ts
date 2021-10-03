import { TrackerMethods } from "../types";
interface Config {
    dsn: string | undefined;
    environment?: string;
}
export declare const SentryAdapter: (config: Config) => TrackerMethods;
export {};
