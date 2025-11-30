import {View} from "react-native";

export interface SpacerViewProps {
    width?: number
    height?: number
    size?: number
}

export default function SpacerView(props: SpacerViewProps) {
    return (
        <View style={{width: props.width ?? props.size, height: props.height ?? props.size}}/>
    )
}
