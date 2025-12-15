import {IToastManager} from "@/src/toasts/Types";
import {Toasts} from "@/src/toasts/Toasts";

export * from './Types'
export * from  './Toasts'
export * from './ToastController'

export const toasts: IToastManager = new Toasts()
