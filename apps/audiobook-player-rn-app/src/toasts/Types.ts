
export enum ToastType {
    Success = 'success',
    Info = 'info',
    Error = 'error',
}

export interface ToastDisplayOptions {
    duration?: number;
}

export interface IToastManager {
    show(type: ToastType, message: string, options?: ToastDisplayOptions): void;
}
