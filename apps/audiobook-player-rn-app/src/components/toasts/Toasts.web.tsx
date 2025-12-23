import {Toaster} from "react-hot-toast";

export interface ToastsProps {}

export function Toasts(props: ToastsProps) {
    return (
        <Toaster position={'top-center'} />
    )
}
