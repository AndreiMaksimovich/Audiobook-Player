import {IToastManager, ToastDisplayOptions, ToastType} from "@/src/lib/toasts/Types";
import {toast, ToastOptions} from "react-hot-toast";

export class ToastManager implements IToastManager {

    show(type: ToastType, message: string, options?: ToastDisplayOptions): void {
        const opts: ToastOptions = {
            duration: options?.duration ?? 3000,
            position: "top-center",
            style: {
                fontSize: 16,
                fontFamily: "sans-serif"
            }
        }

        switch (type) {
            case ToastType.Error:
                toast.error(message, opts);
                break
            case ToastType.Success:
                toast.success(message, opts);
                break
            case ToastType.Info:
            default:
                toast(message, opts);
                break
        }
    }

}
