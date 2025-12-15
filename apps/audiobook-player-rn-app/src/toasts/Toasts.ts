import {IToastManager, ToastDisplayOptions, ToastType} from "@/src/toasts/Types";
import Toast from 'react-native-toast-message';

export class Toasts implements IToastManager{
    show(type: ToastType, message: string, options?: ToastDisplayOptions): void {
        Toast.show({
            type: type,
            text1: message,
            autoHide: true,
            swipeable: true,
            visibilityTime: options?.duration ?? 3000,
            text1Style: {
                fontSize: 16,
                fontFamily: "sans-serif",
            }
        })
    }
}
