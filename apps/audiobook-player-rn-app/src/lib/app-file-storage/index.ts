import {AppFileStorage} from "./AppFileStorage";
import {IAppFileStorage} from "./Types";

export * from './Types'

export const appFileStorage: IAppFileStorage = new AppFileStorage()
