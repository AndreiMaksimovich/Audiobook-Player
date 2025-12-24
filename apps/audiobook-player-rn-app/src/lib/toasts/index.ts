import {IToastManager} from "./Types";
import {ToastManager} from "./ToastManager";

export * from './Types'
export * from './ToastManager'

export const toastManager: IToastManager = new ToastManager()
