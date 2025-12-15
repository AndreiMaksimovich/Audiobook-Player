import {Toaster} from "react-hot-toast";

export interface ToastControllerProps {}

export function ToastController() {
    return (
        <Toaster position={'top-center'} />
    )
}
