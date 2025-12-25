import {AppPersistentStorage} from "./AppPersistentStorage";
import {IAppPersistentStorage} from "@/src/lib/app-persistent-storage/Types";

export * from './Types'
export * from './audiobookToHistoryRecord'

export const appPersistentStorage: IAppPersistentStorage = new AppPersistentStorage();
