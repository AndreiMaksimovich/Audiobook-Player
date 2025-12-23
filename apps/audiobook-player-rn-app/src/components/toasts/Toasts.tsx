import Toast from "react-native-toast-message";

export interface ToastsProps {}

export function Toasts(props: ToastsProps) {
    return (
        <Toast position={"top"} />
    )
}
