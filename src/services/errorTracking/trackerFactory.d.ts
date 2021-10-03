import { TrackerMethods, TrackerPermission } from "./types";
declare type ErrorTrackerFactoryProps = (ExtensionFactory: TrackerMethods, permissions?: TrackerPermission[]) => TrackerMethods;
export declare const ErrorTrackerFactory: ErrorTrackerFactoryProps;
export {};
